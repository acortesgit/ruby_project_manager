import React from "react";
import { createRoot } from "react-dom/client";
import { ApolloClient, ApolloProvider, InMemoryCache, createHttpLink } from "@apollo/client";
import App from "./App";

const csrfToken = document.querySelector("meta[name='csrf-token']")?.getAttribute("content");

const httpLink = createHttpLink({
  uri: "/graphql",
  credentials: "include",
  headers: csrfToken ? { "X-CSRF-Token": csrfToken } : {}
});

const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache()
});

const mountReactApp = () => {
  const rootElement = document.getElementById("root");
  if (!rootElement) return;

  const root = createRoot(rootElement);
  root.render(
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  );
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", mountReactApp);
} else {
  mountReactApp();
}




