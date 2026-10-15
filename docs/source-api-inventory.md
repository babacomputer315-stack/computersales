# Source API inventory

Generated from the Express route declarations in the supplied backend backup. This is a migration checklist, not a claim that these endpoints are already implemented in Django.

## auth.routes.ts

- `POST` `/register`
- `POST` `/verify-otp`
- `POST` `/resend-otp`
- `POST` `/refresh-token`
- `GET` `/profile`
- `PUT` `/profile`
- `POST` `/logout`

## admin/index.route.ts


## user/index.route.ts


## emalls.routes.ts

- `GET` `/`
- `POST` `/`

## torob.routes.ts

- `GET` `/`
- `POST` `/`

## Route modules in source backup

- `auth.routes.ts`
- `emalls.routes.ts`
- `torob.routes.ts`
- `admin/address.routes.ts`
- `admin/auditLogs.route.ts`
- `admin/banners.route.ts`
- `admin/brands.route.ts`
- `admin/coupons.route.ts`
- `admin/files.route.ts`
- `admin/index.route.ts`
- `admin/orderNote.routes.ts`
- `admin/orders.route.ts`
- `admin/payments.route.ts`
- `admin/sheet.route.ts`
- `admin/shippingClasses.route.ts`
- `admin/specifications.route.ts`
- `admin/staticPages.route.ts`
- `admin/user.route.ts`
- `admin/product/attributeValues.route.ts`
- `admin/product/attributes.route.ts`
- `admin/product/categorySpecification.route.ts`
- `admin/product/product.route.ts`
- `admin/product/productCategories.route.ts`
- `admin/product/productComment.route.ts`
- `admin/product/productSpecification.route.ts`
- `admin/product/productTags.route.ts`
- `admin/product/specification.route.ts`
- `admin/blog/blogCategory.routes.ts`
- `admin/blog/blogComment.routes.ts`
- `admin/blog/blogPost.routes.ts`
- `admin/blog/blogTag.routes.ts`
- `user/address.route.ts`
- `user/banner.route.ts`
- `user/blog.route.ts`
- `user/brands.route.ts`
- `user/category.route.ts`
- `user/categorySpecification.route.ts`
- `user/coupon.route.ts`
- `user/files.route.ts`
- `user/index.route.ts`
- `user/order.route.ts`
- `user/payment.route.ts`
- `user/product.route.ts`
- `user/productComment.route.ts`
- `user/shippingClass.route.ts`
- `user/tag.route.ts`
