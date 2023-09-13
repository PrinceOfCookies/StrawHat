const axios = require("axios");
const sqlite3 = require("sqlite3").verbose();

const Tags = {
  1: "Closed",
  2: "Opened",
  3: "Denied",
  4: "Accepted",
  5: "Deleted",
  6: "Staff Report",
  7: "Player Report",
};

const db = new sqlite3.Database("loggedThreads.db", (err) => {
  if (err) {
    console.error("Error connecting to database:", err.message);
  } else {
    console.log("Connected to database");
    initializeDatabase();
  }
});

function initializeDatabase() {
  db.serialize(() => {
    // Create tables for threads and posts if they don't exist
    db.run(`
      CREATE TABLE IF NOT EXISTS threads (
        ThreadID TEXT PRIMARY KEY,
        title TEXT,
        author_name TEXT,
        author_steamid TEXT,
        author_pfp TEXT,
        author_bans TEXT,
        timestamp INTEGER,
        boardID TEXT,
        content TEXT,
        tags TEXT
      )
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS posts (
        PostID TEXT PRIMARY KEY,
        thread_id TEXT,
        author_name TEXT,
        author_steamid TEXT,
        author_pfp TEXT,
        author_bans TEXT,
        timestamp INTEGER,
        content TEXT,
        FOREIGN KEY (thread_id) REFERENCES threads (ThreadID)
      )
    `);
  });

  fetchDataFromAPI();
}

async function fetchDataFromAPI() {
  const apiUrl = "https://bb.bleachy.net/forumfeed";

  try {
    const response = await axios.get(apiUrl);
    const data = response.data;

    for (const threadData of data) {
      const BID = threadData[4];
      const tag = [];

      // Process BID and tag logic here
      try {
        switch (BID) {
          case 5:
            tag.push(Tags[6], Tags[2]);
            break;
          case 6:
            tag.push(Tags[7], Tags[2]);
            break;
          case 10:
            if (tag.includes(Tags[2])) {
              // Replace tag
              tag.splice(tag.indexOf(Tags[2]), 1, Tags[1]);
            } else {
              tag.push(Tags[1]);
            }
            break;
          case 12:
            if (tag.includes(Tags[2])) {
              // Replace tag with 1 and 4
              tag.splice(tag.indexOf(Tags[2]), 1, Tags[1], Tags[4]);
            } else {
              tag.push(Tags[1], Tags[4]);
            }
            break;
          case 13:
            if (tag.includes(Tags[2])) {
              // Replace tag with 1 and 3
              tag.splice(tag.indexOf(Tags[2]), 1, Tags[1], Tags[3]);
            } else {
              tag.push(Tags[1], Tags[3]);
            }
            break;
          case 15:
            if (tag.includes(Tags[2])) {
              // Replace tag with 1 and 4
              tag.splice(tag.indexOf(Tags[2]), 1, Tags[1], Tags[4]);
            } else {
              tag.push(Tags[1], Tags[4]);
            }
            break;
          case 16:
            if (tag.includes(Tags[2])) {
              // Replace tag with 1 and 3
              tag.splice(tag.indexOf(Tags[2]), 1, Tags[1], Tags[3]);
            } else {
              tag.push(Tags[1], Tags[3]);
            }
            break;
          case 17:
            if (tag.includes(Tags[2])) {
              // Replace tag with 1
              tag.splice(tag.indexOf(Tags[2]), 1, Tags[1]);
            } else {
              tag.push(Tags[1]);
            }
            break;
          case 18:
            if (tag.includes(Tags[2])) {
              // Replace tag with 1
              tag.splice(tag.indexOf(Tags[2]), 1, Tags[1]);
            } else {
              tag.push(Tags[1]);
            }
            break;
          case 19:
            if (tag.includes(Tags[2])) {
              // Replace tag with 1
              tag.splice(tag.indexOf(Tags[2]), 1, Tags[1]);
            } else {
              tag.push(Tags[1]);
            }
            break;
        }
      } catch (error) {
        console.error("Error processing tag:", error);
      }
      const thread = {
        ThreadID: threadData[0],
        title: threadData[6],
        author_name: threadData[2],
        author_steamid: threadData[1],
        author_pfp: "pfp link", // Replace with actual pfp link
        author_bans: "", // You can populate bans here if available
        timestamp: new Date(threadData[3]).getTime(),
        boardID: threadData[4],
        content: replaceSpecialCharacters(threadData[7]),
        tags: JSON.stringify(tag),
      };

      insertThreadIntoDatabase(thread);

      for (const postData of threadData) {
        const post = {
          PostID: postData[0],
          thread_id: thread.ThreadID,
          author_name: postData[2],
          author_steamid: postData[1],
          author_pfp: "pfp link", // Replace with actual pfp link
          author_bans: "", // You can populate bans here if available
          timestamp: new Date(postData[3]).getTime(),
          content: replaceSpecialCharacters(postData[7]),
        };

        insertPostIntoDatabase(post);
      }
    }
  } catch (error) {
    console.error("Error fetching data from the API:", error);
  } finally {
    // Close the database connection
    db.close((err) => {
      if (err) {
        console.error("Error closing database:", err.message);
      } else {
        console.log("Database connection closed");
      }
    });
  }
}

function insertThreadIntoDatabase(thread) {
  // Insert thread data into the 'threads' table
  db.run(
    "INSERT INTO threads (ThreadID, title, author_name, author_steamid, author_pfp, author_bans, timestamp, boardID, content, tags) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
    Object.values(thread),
    function (err) {
      if (err) {
        console.error("Error inserting thread data:", err.message);
      } else {
        console.log(`Thread ${thread.ThreadID} inserted successfully`);
      }
    }
  );
}

function insertPostIntoDatabase(post) {
  // Insert post data into the 'posts' table
  db.run(
    "INSERT INTO posts (PostID, thread_id, author_name, author_steamid, author_pfp, author_bans, timestamp, content) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
    Object.values(post),
    function (err) {
      if (err) {
        console.error("Error inserting post data:", err.message);
      } else {
        console.log(`Post ${post.PostID} inserted successfully`);
      }
    }
  );
}

function replaceSpecialCharacters(input) {
  if (typeof input === "string") {
    return input
      .replace(/\\n/g, "\n")
      .replace(/\\t/g, "\t")
      .replace(/&#039;/g, "'")
      .replace(/&quote;/g, '"')
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&amp;/g, "&");
  }
  return input;
}
