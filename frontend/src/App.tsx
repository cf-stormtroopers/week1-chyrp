import { useState } from "react";
import { Route, Switch, Redirect } from "wouter";
import HomePage from "./pages/homenew";
import CreatePostPage from "./pages/create-post";
import ControlsPage from "./pages/controls";
import LoginPage from "./pages/login";

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  console.log(loggedIn);

  return (
    <>
      {!loggedIn ? (
        <Switch>
          <Route path="/login">
            <LoginPage onLogin={() => setLoggedIn(true)} />
          </Route>
          <Route path="*">
            <Redirect to="/login" />
          </Route>
        </Switch>
      ) : (
        <Switch>
          <Route path="/">
            <HomePage />
          </Route>
          <Route path="/create-post">
            <CreatePostPage />
          </Route>
          <Route path="/controls">
            <ControlsPage />
          </Route>
          <Route path="*">
            <Redirect to="/" />
          </Route>
        </Switch>
      )}
    </>
  );
}
