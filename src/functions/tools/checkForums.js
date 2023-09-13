module.exports = async (client) => {
  client.blah = async () => {
    console.log("Noted that checkForums is WIP and not ready for use yet.");
  };
};
// const axios = require("axios");
// const sqlite3 = require("sqlite3").verbose();

// const Tags = {
//   1: "Closed",
//   2: "Opened",
//   3: "Denied",
//   4: "Accepted",
//   5: "Deleted",
//   6: "Staff Report",
//   7: "Player Report",
// };

// module.exports = async (client) => {
//   client.cfbb = async () => {
//     // Connect to your SQLite database (replace 'your-database-name.db' with your actual database file)
//     const db = new sqlite3.Database("loggedThreads.db", (err) => {
//       if (err) {
//         console.error("Error connecting to database:", err.message);
//       } else {
//         console.log("Connected to database");
//       }
//     });

//     db.run(`CREATE TABLE IF NOT EXISTS threads (
//       ThreadID TEXT PRIMARY KEY,
//       title TEXT,
//       author_name TEXT,
//       author_steamid TEXT,
//       author_pfp TEXT,
//       author_bans TEXT,
//       timestamp INTEGER,
//       boardID TEXT,
//       content TEXT,
//       tags TEXT
//     )`);

//     db.run(`CREATE TABLE IF NOT EXISTS posts (
//       PostID TEXT PRIMARY KEY,
//       thread_id TEXT,
//       author_name TEXT,
//       author_steamid TEXT,
//       author_pfp TEXT,
//       author_bans TEXT,
//       timestamp INTEGER,
//       content TEXT,
//       FOREIGN KEY (thread_id) REFERENCES threads (ThreadID)
//     )`);

//     function injectInfo(DBType, info) {
//       try {
//         switch (DBType) {
//           case "threads":
//             // Check if the thread already exists in the database
//             db.get(
//               "SELECT * FROM threads WHERE ThreadID = ?",
//               [info.ThreadID],
//               (err, row) => {
//                 if (err) {
//                   console.error(
//                     "Error checking if thread exists:",
//                     err.message
//                   );
//                 } else if (!row) {
//                   // Insert thread data into the 'threads' table
//                   db.run(
//                     "INSERT INTO threads (ThreadID, title, author_name, author_steamid, author_pfp, author_bans, timestamp, boardID, content, tags) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
//                     Object.values(info),
//                     function (err) {
//                       if (err) {
//                         console.error(
//                           "Error inserting thread data:",
//                           err.message
//                         );
//                       } else {
//                         console.log(
//                           `Thread ${info.ThreadID} inserted successfully`
//                         );
//                       }
//                     }
//                   );
//                 }
//               }
//             );
//             break;
//           case "posts":
//             // Check if the post already exists in the database
//             db.get(
//               "SELECT * FROM posts WHERE PostID = ?",
//               [info.PostID],
//               (err, row) => {
//                 if (err) {
//                   console.error("Error checking if post exists:", err.message);
//                 } else if (!row) {
//                   // Insert post data into the 'posts' table
//                   db.run(
//                     "INSERT INTO posts (PostID, thread_id, author_name, author_steamid, author_pfp, author_bans, timestamp, content) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
//                     Object.values(info),
//                     function (err) {
//                       if (err) {
//                         console.error(
//                           "Error inserting post data:",
//                           err.message
//                         );
//                       } else {
//                         console.log(
//                           `Post ${info.PostID} inserted successfully`
//                         );
//                       }
//                     }
//                   );
//                 }
//               }
//             );
//             break;
//         }
//       } catch (error) {
//         console.error("Error injecting info:", error);
//       }
//     }
//     // API endpoint URL
//     const apiUrl = "https://bb.bleachy.net/forumfeed";
//     console.log("Checking for new threads...")
//     try {
//       // Make a GET request to the API
//       const response = await axios.get(apiUrl);
//       // Assuming response.data is the JSON data you provided
//       const data = response.data;

//       // Process the data and insert it into the SQLite database
//       Object.values(data).forEach((threadData) => {
//         console.log(`Checking thread ${threadData[0][0]}`)
//         let BID = threadData[0][4];
//         let tag = [];

//         try {
//           switch (BID) {
//             case 5:
//               tag.push(Tags[6], Tags[2]);
//               break;
//             case 6:
//               tag.push(Tags[7], Tags[2]);
//               break;
//             case 10:
//               if (tag.includes(Tags[2])) {
//                 // Replace tag
//                 tag.splice(tag.indexOf(Tags[2]), 1, Tags[1]);
//               } else {
//                 tag.push(Tags[1]);
//               }
//               break;
//             case 12:
//               if (tag.includes(Tags[2])) {
//                 // Replace tag with 1 and 4
//                 tag.splice(tag.indexOf(Tags[2]), 1, Tags[1], Tags[4]);
//               } else {
//                 tag.push(Tags[1], Tags[4]);
//               }
//               break;
//             case 13:
//               if (tag.includes(Tags[2])) {
//                 // Replace tag with 1 and 3
//                 tag.splice(tag.indexOf(Tags[2]), 1, Tags[1], Tags[3]);
//               } else {
//                 tag.push(Tags[1], Tags[3]);
//               }
//               break;
//             case 15:
//               if (tag.includes(Tags[2])) {
//                 // Replace tag with 1 and 4
//                 tag.splice(tag.indexOf(Tags[2]), 1, Tags[1], Tags[4]);
//               } else {
//                 tag.push(Tags[1], Tags[4]);
//               }
//               break;
//             case 16:
//               if (tag.includes(Tags[2])) {
//                 // Replace tag with 1 and 3
//                 tag.splice(tag.indexOf(Tags[2]), 1, Tags[1], Tags[3]);
//               } else {
//                 tag.push(Tags[1], Tags[3]);
//               }
//               break;
//             case 17:
//               if (tag.includes(Tags[2])) {
//                 // Replace tag with 1
//                 tag.splice(tag.indexOf(Tags[2]), 1, Tags[1]);
//               } else {
//                 tag.push(Tags[1]);
//               }
//               break;
//             case 18:
//               if (tag.includes(Tags[2])) {
//                 // Replace tag with 1
//                 tag.splice(tag.indexOf(Tags[2]), 1, Tags[1]);
//               } else {
//                 tag.push(Tags[1]);
//               }
//               break;
//             case 19:
//               if (tag.includes(Tags[2])) {
//                 // Replace tag with 1
//                 tag.splice(tag.indexOf(Tags[2]), 1, Tags[1]);
//               } else {
//                 tag.push(Tags[1]);
//               }
//               break;
//           }
//         } catch (error) {
//           console.error("Error processing tag:", error);
//         }

//         const thread = {
//           ThreadID: threadData[0][0],
//           title: threadData[0][6],
//           author_name: threadData[0][2],
//           author_steamid: threadData[0][1],
//           author_pfp: "pfp link", // Replace with actual pfp link
//           author_bans: "", // You can populate bans here if available
//           timestamp: new Date(threadData[0][3]).getTime(), // Convert datetime to Unix timestamp
//           boardID: threadData[0][4],
//           content: replaceSpecialCharacters(threadData[0][7]), // Replace special characters in content
//           tags: JSON.stringify(tag), // Store tags as a JSON string
//         };

//         // Insert thread data into the 'threads' table
//         injectInfo("threads", thread);

//         // Insert post data into the 'posts' table
//         threadData.forEach((postData) => {
//           const post = {
//             PostID: postData[0],
//             thread_id: thread.ThreadID,
//             author_name: postData[2],
//             author_steamid: postData[1],
//             author_pfp: "pfp link", // Replace with actual pfp link
//             author_bans: "", // You can populate bans here if available
//             timestamp: new Date(postData[3]).getTime(), // Convert datetime to Unix timestamp
//             content: replaceSpecialCharacters(postData[7]), // Replace special characters in post content
//           };

//           injectInfo("posts", post);
//         });
//       });
//     } catch (error) {
//       console.error("Error fetching data from the API:", error);
//     } finally {
//       // Close the database connection
//       db.close((err) => {
//         if (err) {
//           console.error("Error closing database:", err.message);
//         } else {
//           console.log("Database connection closed");
//         }
//       });
//     }
//   };

//   // Function to replace special characters in a string
//   function replaceSpecialCharacters(input) {
//     if (typeof input === "string") {
//       return input
//         .replace(/\\n/g, "\n")
//         .replace(/\\t/g, "\t")
//         .replace(/&#039;/g, "'")
//         .replace(/&quote;/g, '"')
//         .replace(/&lt;/g, "<")
//         .replace(/&gt;/g, ">")
//         .replace(/&amp;/g, "&");
//     }
//     return input;
//   }
// };
