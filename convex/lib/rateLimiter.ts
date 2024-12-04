// Generated with Claude AI, don't ask - just happy this works lol
interface RateLimitOptions {
  priorityRequest?: boolean; // Allow bypassing queue for critical requests
  maxRequestsPerSecond?: number;
  maxRequestsPer2Minutes?: number;
}

export default class RateLimiter {
  private requestQueue: Array<{
    promiseFactory: () => Promise<any>;
    resolve: (result: any) => void;
    reject: (error: Error) => void;
    timestamp: number;
  }> = [];

  private requestWindow: Array<number> = [];
  private readonly DEFAULT_MAX_REQUESTS_PER_SECOND = 20;
  private readonly DEFAULT_MAX_REQUESTS_PER_TWO_MINUTES = 100;
  private readonly TWO_MINUTES_MS = 2 * 60 * 1000;

  private maxRequestsPerSecond: number;
  private maxRequestsPer2Minutes: number;
  private isProcessing = false;

  constructor(options: RateLimitOptions = {}) {
    this.maxRequestsPerSecond =
      options.maxRequestsPerSecond ?? this.DEFAULT_MAX_REQUESTS_PER_SECOND;
    this.maxRequestsPer2Minutes =
      options.maxRequestsPer2Minutes ??
      this.DEFAULT_MAX_REQUESTS_PER_TWO_MINUTES;
  }

  private canMakeRequest(now: number): boolean {
    // Remove requests older than 2 minutes
    this.requestWindow = this.requestWindow.filter(
      (timestamp) => now - timestamp < this.TWO_MINUTES_MS,
    );

    return (
      this.requestWindow.length < this.maxRequestsPer2Minutes &&
      this.requestWindow.filter((t) => now - t < 1000).length <
        this.maxRequestsPerSecond
    );
  }

  private async processNextRequest(): Promise<boolean> {
    const now = Date.now();

    // Find the next request that can be processed
    const requestIndex = this.requestQueue.findIndex((request) =>
      this.canMakeRequest(now),
    );

    // No requests can be processed
    if (requestIndex === -1) {
      this.isProcessing = false;
      return false;
    }

    // Remove the request from the queue
    const request = this.requestQueue.splice(requestIndex, 1)[0];

    try {
      // Execute the promise factory
      const result = await request.promiseFactory();

      // Record the timestamp of the request
      this.requestWindow.push(now);

      // Resolve the promise
      request.resolve(result);
    } catch (error) {
      // Reject the promise
      request.reject(error as Error);
    }

    // If there are more requests, continue processing
    if (this.requestQueue.length > 0) {
      return this.processNextRequest();
    }

    this.isProcessing = false;
    return true;
  }

  /**
   * Rate-limited promise executor
   * @param promiseFactory - A function that returns a promise
   * @param options - Rate limit and priority options
   * @returns Promise resolving to the result of the promise factory
   */
  async execute<T>(
    promiseFactory: () => Promise<T>,
    options: RateLimitOptions = {},
  ): Promise<T> {
    // Priority requests bypass the normal rate limiting queue
    if (options.priorityRequest) {
      return promiseFactory();
    }

    // Override class-level rate limits if specified in options
    const maxRequestsPerSecond =
      options.maxRequestsPerSecond ?? this.maxRequestsPerSecond;
    const maxRequestsPer2Minutes =
      options.maxRequestsPer2Minutes ?? this.maxRequestsPer2Minutes;

    // Return a promise that will be resolved when the request can be made
    return new Promise((resolve, reject) => {
      const requestEntry = {
        promiseFactory,
        resolve,
        reject,
        timestamp: Date.now(),
      };

      // Add to queue
      this.requestQueue.push(requestEntry);

      // If not already processing, start processing
      if (!this.isProcessing) {
        this.isProcessing = true;
        this.processNextRequest().catch(console.error);
      }
    });
  }
}
