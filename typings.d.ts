declare module "selly.js" {
  interface DBIndices {
    created_at: string;
    updated_at: string;
  }

  type Gateways =
    "Paypal"
    | "Bitcoin"
    | "Ethereum"
    | "Litecoin"
    | "Bitcoin Cash"
    | "Dash"
    | "Digibyte"
    | "Nano"
    | "Ripple"
    | "ZCash";

  interface Coupon extends DBIndices {
    id: string;
    coupon: string;
    discount?: number;
    max_use: number;
    uses: number;
    product_ids: string[];
    // sorry these are supposed to be dates but I can't
    // be bothered to convert them
  }

  export interface Order extends DBIndices {
    id: string;
    product_id: string;
    email: string;
    ip_address: string
    country_code: string;
    user_agent: string;
    value: number;
    currency: string;
    gateway: Gateways;
    risk_level: number;
    status: number;
    delivered: string;
    crypto_address: string;
    crypto_value: number | null;
    crypto_received: number;
    crypto_confirmations: number;
    crypto_channel?: string;
    referral: string | null;
    exchnge_rate: number;
    custom: object;
  }

  export interface Product extends DBIndices {
    id: string;
    title: string;
    description: string;
    stock: number;
    price: number;
    currency: string;
    product_type: number;
    getways: Gateways[];
    info: string;
    stock_delimiter: string;
    webhook_url: string;
    custom: object;
  }

  export interface ProductGroup extends DBIndices {
    id: string;
    title: string;
    product_ids: string[];
  }

  export interface Query extends DBIndices {
    id: string;
    secret: string;
    status: number;
    email: string;
    ip_address: string;
    country_code: string;
    avatar_url: string;
  }

  export interface Payment extends DBIndices {
    title: string;
    gateway: string;
    email: string;
    value: number;
    currency: string;
    confirmations: number;
    return_url: string;
    webhook_url: string;
    white_label: boolean;
    ip_address: string;
  }


  export interface Selly {
    getCoupons(): Promise<Coupon[]>

    getCoupon(id: string): Promise<Coupon>

    createCoupon(coupon: Partial<Coupon>): Promise<Coupon>

    updateCoupon(id: string, coupon: Partial<Coupon>): Promise<Coupon>

    getOrders(): Promise<Order[]>

    getOrder(id: string): Promise<Order>

    getProducts(): Promise<Product[]>

    getProduct(id: string): Promise<Product>

    createProduct(product: Partial<Product>): Promise<Product>

    updateProduct(id: string, product: Partial<Product>): Promise<Product>

    deleteProduct(id: string): Promise<void>

    getProductGroups(): Promise<ProductGroup[]>

    getProductGroup(id: string): Promise<ProductGroup>

    getQueries(): Promise<Query[]>

    getQuery(id): Promise<Query> & {
      query_message: Array<{
        message: string;
        is_seller: boolean;
      } & DBIndices>;
    }

    createPayment(paymentObject): Promise<Payment>

    deletePayment(id): Promise<{ status: boolean }>
  }

  export function create(email: string, key: string): Selly;
}
