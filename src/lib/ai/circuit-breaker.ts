/**
 * Circuit Breaker Pattern Implementation for AI Service Reliability
 *
 * This implements the circuit breaker pattern to prevent cascading failures
 * and provide graceful degradation when AI services are experiencing issues.
 *
 * Based on the patterns described in the LogRocket article on improving
 * perceived performance and error handling patterns.
 */

export enum CircuitState {
  CLOSED = "CLOSED", // Normal operation
  OPEN = "OPEN", // Service failing, reject requests
  HALF_OPEN = "HALF_OPEN", // Testing if service recovered
}

export interface CircuitBreakerConfig {
  failureThreshold: number; // Number of failures before opening
  recoveryTimeout: number; // Time to wait before testing recovery
  monitoringWindow: number; // Time window for failure tracking
  successThreshold: number; // Successes needed to close from half-open
}

export interface CircuitBreakerStats {
  state: CircuitState;
  failures: number;
  successes: number;
  lastFailureTime: number;
  lastSuccessTime: number;
  totalRequests: number;
  totalFailures: number;
}

export class CircuitBreaker {
  private state: CircuitState = CircuitState.CLOSED;
  private failures: number = 0;
  private successes: number = 0;
  private lastFailureTime: number = 0;
  private lastSuccessTime: number = 0;
  private totalRequests: number = 0;
  private totalFailures: number = 0;

  constructor(
    private readonly config: CircuitBreakerConfig,
    private readonly serviceName: string
  ) {}

  /**
   * Execute a function with circuit breaker protection
   */
  async execute<T>(
    operation: () => Promise<T>,
    fallback?: () => Promise<T>
  ): Promise<T> {
    this.totalRequests++;

    // Check if circuit is open
    if (this.state === CircuitState.OPEN) {
      if (this.shouldAttemptReset()) {
        this.state = CircuitState.HALF_OPEN;
        console.log(
          `[CircuitBreaker:${this.serviceName}] Attempting recovery - state: HALF_OPEN`
        );
      } else {
        // Circuit is open, use fallback or throw error
        if (fallback) {
          console.log(
            `[CircuitBreaker:${this.serviceName}] Circuit OPEN - using fallback`
          );
          return await fallback();
        }
        throw new Error(
          `[CircuitBreaker:${this.serviceName}] Service unavailable - circuit OPEN`
        );
      }
    }

    try {
      const result = await operation();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();

      // If we have a fallback, use it instead of throwing
      if (fallback) {
        console.log(
          `[CircuitBreaker:${this.serviceName}] Operation failed - using fallback`
        );
        return await fallback();
      }

      throw error;
    }
  }

  /**
   * Record a successful operation
   */
  private onSuccess(): void {
    this.lastSuccessTime = Date.now();
    this.failures = 0; // Reset failure count

    if (this.state === CircuitState.HALF_OPEN) {
      this.successes++;
      if (this.successes >= this.config.successThreshold) {
        this.state = CircuitState.CLOSED;
        this.successes = 0;
        console.log(
          `[CircuitBreaker:${this.serviceName}] Recovery successful - state: CLOSED`
        );
      }
    }
  }

  /**
   * Record a failed operation
   */
  private onFailure(): void {
    this.lastFailureTime = Date.now();
    this.failures++;
    this.totalFailures++;

    if (this.state === CircuitState.HALF_OPEN) {
      // Failed during recovery attempt
      this.state = CircuitState.OPEN;
      this.successes = 0;
      console.log(
        `[CircuitBreaker:${this.serviceName}] Recovery failed - state: OPEN`
      );
    } else if (this.failures >= this.config.failureThreshold) {
      // Too many failures, open the circuit
      this.state = CircuitState.OPEN;
      console.log(
        `[CircuitBreaker:${this.serviceName}] Failure threshold exceeded - state: OPEN`
      );
    }
  }

  /**
   * Check if we should attempt to reset the circuit
   */
  private shouldAttemptReset(): boolean {
    const timeSinceLastFailure = Date.now() - this.lastFailureTime;
    return timeSinceLastFailure >= this.config.recoveryTimeout;
  }

  /**
   * Get current circuit breaker statistics
   */
  getStats(): CircuitBreakerStats {
    return {
      state: this.state,
      failures: this.failures,
      successes: this.successes,
      lastFailureTime: this.lastFailureTime,
      lastSuccessTime: this.lastSuccessTime,
      totalRequests: this.totalRequests,
      totalFailures: this.totalFailures,
    };
  }

  /**
   * Reset the circuit breaker (for testing or manual intervention)
   */
  reset(): void {
    this.state = CircuitState.CLOSED;
    this.failures = 0;
    this.successes = 0;
    console.log(
      `[CircuitBreaker:${this.serviceName}] Manual reset - state: CLOSED`
    );
  }

  /**
   * Force open the circuit (for maintenance)
   */
  forceOpen(): void {
    this.state = CircuitState.OPEN;
    console.log(
      `[CircuitBreaker:${this.serviceName}] Forced open - state: OPEN`
    );
  }
}

/**
 * Exponential Backoff Implementation
 */
export class ExponentialBackoff {
  constructor(
    private readonly initialDelay: number = 1000, // Start with 1 second
    private readonly maxDelay: number = 30000, // Max 30 seconds
    private readonly backoffFactor: number = 2, // Double each time
    private readonly jitter: boolean = true // Add randomization
  ) {}

  /**
   * Calculate delay for the given attempt number
   */
  calculateDelay(attempt: number): number {
    let delay = this.initialDelay * Math.pow(this.backoffFactor, attempt - 1);
    delay = Math.min(delay, this.maxDelay);

    // Add jitter to prevent thundering herd
    if (this.jitter) {
      delay = delay * (0.5 + Math.random() * 0.5);
    }

    return Math.round(delay);
  }

  /**
   * Sleep for the calculated delay
   */
  async sleep(attempt: number): Promise<void> {
    const delay = this.calculateDelay(attempt);
    console.log(
      `[ExponentialBackoff] Waiting ${delay}ms before attempt ${attempt}`
    );
    return new Promise((resolve) => setTimeout(resolve, delay));
  }
}

/**
 * Retry with exponential backoff
 */
export async function retryWithBackoff<T>(
  operation: () => Promise<T>,
  maxAttempts: number = 3,
  backoff: ExponentialBackoff = new ExponentialBackoff()
): Promise<T> {
  let lastError: Error;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error as Error;
      console.warn(`[RetryWithBackoff] Attempt ${attempt} failed:`, error);

      if (attempt === maxAttempts) {
        break; // Don't sleep on the last attempt
      }

      await backoff.sleep(attempt);
    }
  }

  throw new Error(
    `Operation failed after ${maxAttempts} attempts. Last error: ${
      lastError!.message
    }`
  );
}

/**
 * Circuit breaker instances for different services
 */
export const AI_CIRCUIT_BREAKERS = {
  grok: new CircuitBreaker(
    {
      failureThreshold: 5, // Open after 5 failures
      recoveryTimeout: 60000, // Wait 1 minute before testing
      monitoringWindow: 300000, // 5 minute window
      successThreshold: 3, // Need 3 successes to fully recover
    },
    "Grok-AI"
  ),

  embedding: new CircuitBreaker(
    {
      failureThreshold: 3, // More sensitive for embeddings
      recoveryTimeout: 30000, // 30 seconds
      monitoringWindow: 180000, // 3 minute window
      successThreshold: 2, // Need 2 successes
    },
    "Embedding-Service"
  ),

  memory: new CircuitBreaker(
    {
      failureThreshold: 10, // Memory extraction is less critical
      recoveryTimeout: 120000, // 2 minutes
      monitoringWindow: 600000, // 10 minute window
      successThreshold: 3, // Need 3 successes
    },
    "Memory-Extraction"
  ),

  pinecone: new CircuitBreaker(
    {
      failureThreshold: 7, // Vector DB has some tolerance
      recoveryTimeout: 90000, // 1.5 minutes
      monitoringWindow: 300000, // 5 minute window
      successThreshold: 2, // Need 2 successes
    },
    "Pinecone-VectorDB"
  ),
};

/**
 * Health check for all AI services
 */
export function getAIServiceHealth(): Record<string, CircuitBreakerStats> {
  return {
    grok: AI_CIRCUIT_BREAKERS.grok.getStats(),
    embedding: AI_CIRCUIT_BREAKERS.embedding.getStats(),
    memory: AI_CIRCUIT_BREAKERS.memory.getStats(),
    pinecone: AI_CIRCUIT_BREAKERS.pinecone.getStats(),
  };
}
