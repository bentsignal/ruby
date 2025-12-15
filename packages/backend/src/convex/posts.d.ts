export declare const getAll: import("convex/server").RegisteredQuery<"public", {}, Promise<{
    _id: import("convex/values").GenericId<"posts">;
    _creationTime: number;
    title: string;
    content: string;
}[]>>;
export declare const create: import("convex/server").RegisteredMutation<"public", {
    title: string;
    content: string;
}, Promise<import("convex/values").GenericId<"posts">>>;
//# sourceMappingURL=posts.d.ts.map