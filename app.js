const supabase = window.supabase.createClient(
  "YOUR_SUPABASE_URL",
  "YOUR_PUBLIC_KEY"
);

let user = null;
let score = 0;
let current = 0;

let questions = [
{
q:"Most common cause of pulpitis?",
a:["Trauma","Caries","Attrition","Erosion"],
correct:1
},
{
q:"First step in RCT?",
a:["Obturation","Access","Irrigation","Filling"],
correct:1
}
];

// 🔐 AUTH
async function signup(){
let email = document.getElementById("email").value;
let password = document.getElementById("password").value;

await supabase.auth.signUp({ email, password });
alert("Check your email");
}

async function login(){
let email = document.getElementById("email").value;
let password = document.getElementById("password").value;

let { data } = await supabase.auth.signInWithPassword({ email, password });

user = data.user;

document.getElementById("auth").style.display="none";
document.getElementById("game").style.display="block";

loadQuestion();
loadLeaderboard();
}

// 🧠 GAME
function loadQuestion(){
let q = questions[current];
document.getElementById("question").innerText = q.q;

let answers = document.getElementById("answers");
answers.innerHTML = "";

q.a.forEach((ans,i)=>{
let btn = document.createElement("button");
btn.innerText = ans;

btn.onclick = ()=>{
if(i === q.correct){
score++;
btn.classList.add("correct");
}else{
btn.classList.add("wrong");
}

document.getElementById("score").innerText = "Score: " + score;
};

answers.appendChild(btn);
});
}

function nextQuestion(){
current++;
if(current >= questions.length){
saveScore();
return;
}
loadQuestion();
}

// 💾 SAVE SCORE
async function saveScore(){
await supabase.from("scores").insert([
{ user_id: user.id, score: score }
]);

alert("Score saved!");
loadLeaderboard();
}

// 🏆 LEADERBOARD
async function loadLeaderboard(){
let { data } = await supabase
.from("scores")
.select("*")
.order("score", { ascending:false })
.limit(10);

let list = document.getElementById("leaderboard");
list.innerHTML = "";

data.forEach(row=>{
let li = document.createElement("li");
li.innerText = row.score;
list.appendChild(li);
});
}
