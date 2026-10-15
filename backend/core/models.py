
from django.db import models


class StockStatus(models.TextChoices):
    OUT_OF_STOCK = "outofstock", "ناموجود"
    IN_STOCK = "instock", "موجود"
    PREORDER = "preorder", "پیش‌فروش"


class File(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255, null=True, blank=True)
    size = models.IntegerField(null=True, blank=True)
    type = models.CharField(max_length=100, null=True, blank=True)
    created_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = "files"
        managed = True


class Brand(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255)
    slug = models.CharField(max_length=255, unique=True)
    description = models.TextField(null=True, blank=True)
    website = models.CharField(max_length=500, null=True, blank=True)
    image = models.ForeignKey(
        File,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        db_column="image_id",
        related_name="brands",
    )
    is_active = models.BooleanField(default=True, null=True, blank=True)
    is_featured = models.BooleanField(default=False, null=True, blank=True)
    seo_title = models.CharField(max_length=255, null=True, blank=True)
    seo_description = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(null=True, blank=True)
    updated_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = "brands"
        managed = True


class ProductCategory(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255)
    slug = models.CharField(max_length=255, unique=True)
    parent = models.ForeignKey(
        "self",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        db_column="parent_id",
        related_name="children",
    )
    image = models.ForeignKey(
        File,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        db_column="image_id",
        related_name="category_images",
    )
    banner = models.ForeignKey(
        File,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        db_column="banner_id",
        related_name="category_banners",
    )
    description = models.TextField(null=True, blank=True)
    seo_title = models.CharField(max_length=255, null=True, blank=True)
    seo_description = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(null=True, blank=True)
    updated_at = models.DateTimeField(null=True, blank=True)
    order = models.IntegerField(default=0, null=True, blank=True)

    class Meta:
        db_table = "product_categories"
        managed = True


class Product(models.Model):
    id = models.AutoField(primary_key=True)
    sku = models.CharField(max_length=100, null=True, blank=True, unique=True)
    name = models.CharField(max_length=255)
    is_published = models.BooleanField(default=False, null=True, blank=True)
    short_description = models.TextField(null=True, blank=True)
    long_description = models.TextField(null=True, blank=True)
    regular_price = models.BigIntegerField(null=True, blank=True)
    sale_price = models.BigIntegerField(null=True, blank=True)
    sale_start_date = models.DateTimeField(null=True, blank=True)
    sale_end_date = models.DateTimeField(null=True, blank=True)
    stock_quantity = models.IntegerField(default=0, null=True, blank=True)
    stock_status = models.CharField(
        max_length=20,
        choices=StockStatus.choices,
        default=StockStatus.IN_STOCK,
        null=True,
        blank=True,
    )
    show_stock = models.BooleanField(default=True, null=True, blank=True)
    is_featured = models.BooleanField(default=False, null=True, blank=True)
    is_single_purchase = models.BooleanField(default=False, null=True, blank=True)
    shipping_class_id = models.IntegerField(null=True, blank=True)
    weight = models.IntegerField(null=True, blank=True)
    length = models.IntegerField(null=True, blank=True)
    width = models.IntegerField(null=True, blank=True)
    height = models.IntegerField(null=True, blank=True)
    seo_title = models.CharField(max_length=255, null=True, blank=True)
    seo_description = models.TextField(null=True, blank=True)
    slug = models.CharField(max_length=255, null=True, blank=True, unique=True)
    created_at = models.DateTimeField(null=True, blank=True)
    updated_at = models.DateTimeField(null=True, blank=True)
    brand = models.ForeignKey(
        Brand,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        db_column="brand_id",
        related_name="products",
    )
    name_en = models.CharField(max_length=255, null=True, blank=True)
    purchase_limit = models.IntegerField(null=True, blank=True)
    html_description = models.TextField(null=True, blank=True)
    categories = models.ManyToManyField(
        ProductCategory,
        through="ProductToCategory",
        related_name="products",
    )

    class Meta:
        db_table = "products"
        managed = True


class ProductImage(models.Model):
    id = models.AutoField(primary_key=True)
    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE,
        db_column="product_id",
        related_name="images",
    )
    file = models.ForeignKey(
        File,
        on_delete=models.CASCADE,
        db_column="file_id",
        related_name="product_images",
    )
    is_thumbnail = models.BooleanField(default=False, null=True, blank=True)
    order = models.IntegerField(default=0, null=True, blank=True)
    alt = models.CharField(max_length=255, null=True, blank=True)
    created_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = "product_images"
        managed = True


class ProductToCategory(models.Model):
    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE,
        db_column="product_id",
    )
    category = models.ForeignKey(
        ProductCategory,
        on_delete=models.CASCADE,
        db_column="category_id",
    )
    is_primary = models.BooleanField(default=False, null=True, blank=True)

    class Meta:
        db_table = "product_to_categories"
        managed = False


class ProductVariation(models.Model):
    id = models.AutoField(primary_key=True)
    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE,
        db_column="product_id",
        related_name="variations",
    )
    sku = models.CharField(max_length=100, null=True, blank=True, unique=True)
    price = models.BigIntegerField(null=True, blank=True)
    sale_price = models.BigIntegerField(null=True, blank=True)
    sale_start_date = models.DateTimeField(null=True, blank=True)
    sale_end_date = models.DateTimeField(null=True, blank=True)
    stock_quantity = models.IntegerField(default=0, null=True, blank=True)
    stock_status = models.CharField(
        max_length=20,
        choices=StockStatus.choices,
        default=StockStatus.OUT_OF_STOCK,
    )
    image_file = models.ForeignKey(
        File,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        db_column="image_file_id",
        related_name="variation_images",
    )
    image_alt = models.CharField(max_length=255, null=True, blank=True)
    is_archived = models.BooleanField(default=False, null=True, blank=True)
    created_at = models.DateTimeField(null=True, blank=True)
    updated_at = models.DateTimeField(null=True, blank=True)
    purchase_limit = models.IntegerField(null=True, blank=True)

    class Meta:
        db_table = "product_variations"
        managed = True
