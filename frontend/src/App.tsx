import { useEffect } from "react";
import { Route, Switch, Redirect } from "wouter";
import HomePage from "./pages/home";
import CreatePostPage from "./pages/create-post";
import ControlsPage from "./pages/controls";
import AdminPage from "./pages/AdminPage";
import LoginPage from "./pages/login";
import { useGetSiteInfoSiteInfoGet } from "./api/generated";
import { useAuthStore } from "./state/auth";
import SettingsPage from "./pages/SettingsPage";
import ManagePage from "./pages/ManagePage";
import ExtendPage from "./pages/ExtendPage";
//for formatting buttons
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";


export default function App() {
  const authStore = useAuthStore();

  const { data, isLoading, error } = useGetSiteInfoSiteInfoGet();
  const siteInfo = data;

  useEffect(() => {
    authStore.setBlogTitle(siteInfo?.blog_title || "");

    const apiExtensions = siteInfo?.extensions ?? [];
    authStore.setExtensions({
      comments: apiExtensions.includes("comments"),
      likes: apiExtensions.includes("likes"),
      views: apiExtensions.includes("views"),
      tags: apiExtensions.includes("tags"),
    });

    const loggedIn = (siteInfo?.user?.id ?? "").length > 0;

    authStore.setLoggedIn(loggedIn);
    authStore.setAccountInformation(siteInfo?.user || null);
  }, [data]);

  if (isLoading || authStore.blogTitle === "") {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{JSON.stringify(error)}</p>;
  }

  // console.log(["Is logged in?", authStore.loggedIn]);

  return (
    <>
      {!authStore.loggedIn ? (
        <Switch>
          <Route path="/login">
            <LoginPage />
          </Route>
          <Route path="*">
            <Redirect to="/login" />
          </Route>
        </Switch>
      ) : (
        <Switch>
          {/* Pages */}
          <Route path="/" component={HomePage} />
          <Route path="/create-post" component={CreatePostPage} />
          <Route path="/controls" component={ControlsPage} />
          <Route path="/admin" component={AdminPage} /> {/* ✅ fixed lowercase route */}
          <Route path="/settings" component={SettingsPage} />
          <Route path="/manage" component={ManagePage} />
          <Route path="/extend" component={ExtendPage} />


          {/* Catch-all redirect (goes last) */}
          <Route path="*">
            <Redirect to="/" />
          </Route>
        </Switch>
      )}
    </>
  );
}
