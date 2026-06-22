const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const userRoutesPath = path.join(__dirname, "..", "Routes", "User.Routes.js");

test("user profile read and update routes require token ownership checks", () => {
    const source = fs.readFileSync(userRoutesPath, "utf8");

    assert.match(
        source,
        /route\.get\("\/UserProfile\/:id",\s*tokenVeryfy,\s*isOwner,\s*UserController\.userProfile\)/,
        "profile reads must be limited to the authenticated owner or admin"
    );

    assert.match(
        source,
        /route\.post\("\/updateUser\/:id",\s*tokenVeryfy,\s*isOwner,\s*UserController\.editUserProfile\)/,
        "profile updates must be limited to the authenticated owner or admin"
    );
});
