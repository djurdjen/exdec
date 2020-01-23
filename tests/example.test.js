import { RequestLogger } from "testcafe";
import Login from "./Actions/Login";
import AddEntry from "./Actions/AddEntry";
import RemoveEntry from "./Actions/RemoveEntry";

// define http request logger
const base = "http://localhost:8080";
const logRequests = RequestLogger(new RegExp(`(${base}/api/).+`), {
  logResponseHeaders: true,
  logResponseBody: true,
  logRequestHeaders: true,
  logRequestBody: true
});
fixture(`Login page`)
  .page(`${base}/login`)
  .requestHooks(logRequests);

test("Succesful login", async t => {
  await new Login(t).login();
  const location = await t.eval(() => window.location);
  await t.expect(location.pathname).eql("/");
});

test("Add entry", async t => {
  await new Login(t).login();

  const newEntry = new AddEntry(t);
  await newEntry.fill({ transport: "car" });
  await t
    .expect(
      logRequests.contains(
        r =>
          r.request.url === `${base}/api/entries` &&
          r.request.method === "post" &&
          r.response.statusCode === 200
      )
    )
    .ok();
});

test("Remove entry", async t => {
  await new Login(t).login();
  const removeEntry = new RemoveEntry(t);
  await removeEntry.remove();
  await t
    .expect(
      logRequests.contains(
        r =>
          new RegExp(`(${base}/api/entries/)\\d+$`, "g").test(r.request.url) &&
          r.request.method === "delete" &&
          r.response.statusCode === 200
      )
    )
    .ok();
});
