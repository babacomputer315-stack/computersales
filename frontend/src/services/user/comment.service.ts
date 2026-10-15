import httpClient from "@/services/httpClient";
import { ResponseModel } from "@/services/response-model";
import { ProductComment } from "@/types/productComment";

export interface CreateCommentRequest {
  content: string;
  rating: number;
}

export interface CommentsListResponse {
  data: ProductComment[];
  message: string;
  success: boolean;
}

class CommentService {
  // Get all user product comments
  async getProductComments(productId: number): Promise<CommentsListResponse> {
    const response = await httpClient.get(
      `/user/products/${productId}/comments`
    );
    return response.data;
  }

  // Create new comment
  async createComment(
    productId: number,
    commentData: CreateCommentRequest
  ): Promise<ResponseModel<Comment>> {
    const response = await httpClient.post(
      `/user/products/${productId}/comments`,
      commentData
    );
    return response.data;
  }
}

export default new CommentService();
