import { businesses } from "@/../public/data/businesses.json";

export type BusinessId = `bus-${string}`;

export type Business = (typeof businesses)[0];
