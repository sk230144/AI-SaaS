import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
    index("routes/home.tsx"),
    route("visualizer/:id", './routes/visualizer.$id.tsx'),
    route("product", './routes/product.tsx'),
    route("pricing", './routes/pricing.tsx'),
    route("community", './routes/community.tsx'),
    route("enterprise", './routes/enterprise.tsx'),
    route("demo", './routes/demo.tsx'),
] satisfies RouteConfig;
