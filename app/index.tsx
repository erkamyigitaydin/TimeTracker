// app/index.tsx
import { Redirect } from "expo-router";
import { routes } from "../src/constants/ui";

export default function Index() {
  return <Redirect href={routes.auth as any} />;
}