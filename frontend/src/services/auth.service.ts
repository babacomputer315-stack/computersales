import httpClient from "./httpClient";

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface User {
  id: number;
  name?: string;
  firstName?: string;
  lastName?: string;
  nationalCode?: string;
  email?: string;
  phone?: string;
  birthDate?: string;
  mobile: string;
  role: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface LoginResponse {
  user: User;
  tokens: AuthTokens;
}

export interface RegisterResponse {
  message: string;
  userId?: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  errors?: any;
}

class AuthService {
  private static readonly TOKEN_KEY = "accessToken";
  private static readonly REFRESH_TOKEN_KEY = "refreshToken";
  private static readonly USER_KEY = "user";

  /**
   * Register user and send OTP
   */
  static async register(mobile: string): Promise<RegisterResponse> {
    const response = await httpClient.post<ApiResponse<RegisterResponse>>(
      "/auth/register",
      {
        mobile,
      }
    );
    return response?.data?.data;
  }

  /**
   * Verify OTP and login user
   */
  static async verifyOTPAndLogin(
    mobile: string,
    otpCode: string
  ): Promise<LoginResponse> {
    const response = await httpClient.post<ApiResponse<LoginResponse>>(
      "/auth/verify-otp",
      {
        mobile,
        otpCode,
      }
    );

    const { user, tokens } = response.data.data;

    // Store tokens and user data
    this.setTokens(tokens);
    this.setUser(user);

    return response.data.data;
  }

  /**
   * Resend OTP to user
   */
  static async resendOTP(mobile: string): Promise<{ message: string }> {
    const response = await httpClient.post<ApiResponse<{ message: string }>>(
      "/auth/resend-otp",
      {
        mobile,
      }
    );
    return response?.data?.data;
  }

  /**
   * Refresh access token
   */
  static async refreshToken(): Promise<AuthTokens> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      throw new Error("No refresh token available");
    }

    const response = await httpClient.post<ApiResponse<{ tokens: AuthTokens }>>(
      "/auth/refresh-token",
      {
        refreshToken,
      }
    );

    const { tokens } = response.data.data;
    this.setTokens(tokens);

    return tokens;
  }

  /**
   * Get user profile
   */
  static async getProfile(): Promise<User> {
    const response = await httpClient.get<ApiResponse<User>>("/auth/profile");
    return response.data.data;
  }

  /**
   * Update user profile
   */
  static async updateProfile(data: {
    name?: string;
    nationalCode?: string;
    email?: string;
    phone?: string;
    birthDate?: string;
  }): Promise<User> {
    const response = await httpClient.put<ApiResponse<User>>(
      "/auth/profile",
      data
    );
    const user = response.data.data;
    this.setUser(user);
    return user;
  }

  /**
   * Logout user
   */
  static async logout(): Promise<{ message: string }> {
    try {
      const refreshToken = this.getRefreshToken();
      if (refreshToken) {
        const response = await httpClient.post<
          ApiResponse<{ message: string }>
        >("/auth/logout");
        return response.data.data;
      }
    } finally {
      this.clearAuth();
    }
    return { message: "Logged out locally" };
  }

  // static async logout(): Promise<{ message: string }> {
  //   try {
  //     const response = await httpClient.post<ApiResponse<{ message: string }>>(
  //       "/auth/logout"
  //     );
  //     return response.data.data;
  //   } finally {
  //     this.clearAuth();
  //   }
  // }

  /**
   * Check if user is authenticated
   */
  static isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) return false;

    // Check if token is expired
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const expiryTime = payload.exp * 1000; // Convert to milliseconds
      const currentTime = Date.now();

      if (currentTime >= expiryTime) {
        // Token is expired, clear it
        this.clearAuth();
        return false;
      }

      return true;
    } catch (error) {
      // Invalid token format, clear it
      this.clearAuth();
      return false;
    }
  }

  /**
   * Check if token is about to expire (within 5 minutes)
   */
  static isTokenExpiringSoon(): boolean {
    const token = this.getToken();
    if (!token) return false;

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const expiryTime = payload.exp * 1000; // Convert to milliseconds
      const currentTime = Date.now();
      const timeUntilExpiry = expiryTime - currentTime;

      // Return true if token expires in less than 5 minutes
      return timeUntilExpiry < 5 * 60 * 1000 && timeUntilExpiry > 0;
    } catch (error) {
      return false;
    }
  }

  /**
   * Get current user
   */
  static getCurrentUser(): User | null {
    const userStr = localStorage.getItem(this.USER_KEY);
    if (!userStr) return null;

    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  }

  /**
   * Get access token
   */
  static getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  /**
   * Get refresh token
   */
  static getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  /**
   * Set tokens in localStorage
   */
  private static setTokens(tokens: AuthTokens): void {
    localStorage.setItem(this.TOKEN_KEY, tokens.accessToken);
    localStorage.setItem(this.REFRESH_TOKEN_KEY, tokens.refreshToken);
  }

  /**
   * Set user data in localStorage
   */
  private static setUser(user: User): void {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  /**
   * Clear all authentication data
   */
  private static clearAuth(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
  }

  /**
   * Validate Iranian mobile number
   */
  static validateMobile(mobile: string): boolean {
    const mobileRegex = /^09\d{9}$/;
    return mobileRegex.test(mobile);
  }

  /**
   * Validate OTP code
   */
  static validateOTP(otp: string): boolean {
    return otp.length === 4 && /^\d{4}$/.test(otp);
  }

  static validateNationalCode(nationalCode: string): boolean {
    return nationalCode.length === 10 && /^\d{10}$/.test(nationalCode);
  }
}

export default AuthService;
