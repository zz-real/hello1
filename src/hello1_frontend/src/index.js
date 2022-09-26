import {
  hello1_backend,
  createActor,
} from "../../declarations/hello1_backend";

//发布
async function post() {
  let post_button = document.getElementById("post");
  post_button.disabled = true;
  let textarea = document.getElementById("message");
  let otp = document.getElementById("otp").value;
  let text = textarea.value;
  try {
    await hello1_backend.post(otp, text);
  } catch (e) {
    console.log(e);
    document.getElementById("error").innerText = "Post failed";
  }
  post_button.disabled = false;
}

var num_posts = 0;

//load_posts 加载发布内容
async function load_posts() {
  let posts_section = document.getElementById("posts");
  let posts = await hello1_backend.posts(0);
  if (num_posts === posts.length) return;
  posts_section.replaceChildren([]);
  num_posts = posts.length;
  for (var i = 0; i < posts.length; i++) {
    let post_metainfo = document.createElement("p");
    post_metainfo.innerText = posts[i].author + " post in " + timeConverter(posts[i].time);
    let post_msg = document.createElement("p");
    post_msg.innerText = posts[i].text;

    posts_section.appendChild(post_metainfo);
    posts_section.appendChild(post_msg);
  }
}

var num_follows = 0;

//load_follows 加载关注用户
async function load_follows() {
  let follows_section = document.getElementById("follows");
  let follows = await hello1_backend.follows();
  if (num_follows === follows.length) return;
  follows_section.replaceChildren([]);
  num_follows = follows.length;
  for (var i = 0; i < follows.length; i++) {
    // let post = document.createElement("p");
    // post.innerText = follows[i];
    // follows_section.appendChild(post);

    let single = document.createElement("button");
    single.style.marginLeft = "20px";
    single.className = "follow";
    single.innerText = follows[i];
    single.onclick = followClick;
    follows_section.appendChild(single);

  }
}

async function followClick(e) {
  let followlist = document.getElementById("followlist");
  followlist.replaceChildren([]);
  let idFilter = e.target.innerText;
  let followBlog = createActor(idFilter);
  let posts = await followBlog.posts(0);
  for (var i = 0; i < posts.length; i++) {
    let post_metainfo = document.createElement("p");
    post_metainfo.innerText =
      posts[i].author + " post in " + timeConverter(posts[i].time);
    let post_msg = document.createElement("p");
    post_msg.innerText = posts[i].text;

    followlist.appendChild(post_metainfo);
    followlist.appendChild(post_msg);
  }
}

var num_timeline = 0;

async function load_timeline() {
  let timeline_section = document.getElementById("timeline");
  let timeline = await hello1_backend.timeline(0);
  if (num_timeline === timeline.length) return;
  timeline_section.replaceChildren([]);
  num_timeline = timeline.length;
  for (var i = 0; i < timeline.length; i++) {
    let timeline_metainfo = document.createElement("p");
    timeline_metainfo.innerText = timeline[i].author + " post in " + timeConverter(timeline[i].time);
    let timeline_msg = document.createElement("p");
    timeline_msg.innerText = timeline[i].text;

    timeline_section.appendChild(timeline_metainfo);
    timeline_section.appendChild(timeline_msg);
  }
}

function timeConverter(UNIX_timestamp) {
  var a = new Date(Number(UNIX_timestamp / 1000000n));
  const humanDateFormat = a.toLocaleString();
  return humanDateFormat;
}

function load() {
  let post_button = document.getElementById("post");
  post_button.onclick = post;
  load_posts();
  load_follows();
  load_timeline();
  setInterval(load_posts, 3000);
}

window.onload = load;
