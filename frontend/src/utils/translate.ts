interface WordsModel {
  [key: string]: {
    single: string;
    plural: string;
  };
}
export const t = (key: string, single: boolean = false) => {
  const names: WordsModel = {
    product_categories: { single: "دسته‌ بندی", plural: "دسته‌ بندی‌ ها" },
    product_tags: { single: "برچسب", plural: "برچسب ها" },
    products: { single: "محصول", plural: "محصولات" },
    users: { single: "مشتری", plural: "مشتریان" },
    static_pages: { single: "صفحه", plural: "صفحات" },
    shipping_classes: {
      single: "کلاس حمل و نقل",
      plural: "کلاس های حمل و نقل",
    },
    attributes: { single: "ویژگی", plural: "ویژگی ها" },
    attribute_values: { single: "مشخصه", plural: "مشخصه ها" },
    blog_categories: { single: "دسته بندی بلاگ", plural: "دسته بندی های بلاگ" },
    blog_tags: { single: "برچسب بلاگ", plural: "برچسب های بلاگ" },
    blog_posts: { single: "پست بلاگ", plural: "پست های بلاگ" },
    blog_comments: { single: "نظر", plural: "نظرات" },
    orders: { single: "سفارش", plural: "سفارشات" },
    payments: { single: "تراکنش", plural: "تراکنش ها" },
  };

  const word = names[key];
  if (!word) return key;

  return single ? word.single : word.plural;
};
