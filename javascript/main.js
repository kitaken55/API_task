// デバック用
const p = console.log;

//よく使う関数

// APIのURL
const urlSignUp = "https://teachapi.herokuapp.com/sign_up";
const urlSignIn = "https://teachapi.herokuapp.com/sign_in";
const urlUsers = "https://teachapi.herokuapp.com/users";

// Headersの用意
const myHeaders = new Headers();
// Headersにjsonを読み込むものを挿入
myHeaders.append("Content-Type", "application/json");

//---------1.新規作成
function sign_up() {
    const user_name = document.querySelector("#user_name").value;
    const user_bio = document.querySelector("#user_bio").value;
    const user_email = document.querySelector("#user_email").value;
    const user_password = document.querySelector("#user_password").value;
    const user_password_confirmation = document.querySelector("#user_password_confirmation").value;

    const BodyData = {
        "sign_up_user_params": {
            "name": user_name,
            "bio": user_bio,
            "email": user_email,
            "password": user_password,
            "password_confirmation": user_password_confirmation
        }
    }

    const myBody = JSON.stringify(BodyData);

    const requestOptions = {
        method: "POST",
        body: myBody,
        headers: myHeaders
    }

    fetch(urlSignUp, requestOptions)
        .then(response =>  response.json())
        .then(json => {
            //ユーザ生成時に以下の情報をローカルストレージに入れる。
            localStorage.token = json.token,
            localStorage.id = json.id,
            localStorage.name = json.name,
            localStorage.bio = json.bio
            window.location.href = 'users.html';
        })
        .catch(error => console.error(`Error: ${error}`));
}


//------------2.ログイン関数
function login_user() {
    const user_email = document.querySelector("#user_email").value;
    const user_password = document.querySelector("#user_password").value;
    const user_password_confirmation = document.querySelector("#user_password_confirmation").value;

    const BodyData = {
        "sign_in_user_params": {
            "email": user_email,
            "password": user_password,
            "password_confirmation": user_password_confirmation
        }
    }

    const myBody = JSON.stringify(BodyData);

    const requestOptions = {
        method: "POST",
        body: myBody,
        headers: myHeaders
    }

    fetch(urlSignIn, requestOptions)
        .then(response => response.json())
        .then(json => {
            localStorage.token = json.token;
            if (localStorage.token) {
                console.log("ログイン中です");
                window.location.href = './users.html';
            }
        })
        .catch(error => console.log(`Error: ${error}`));
}


//------------ログアウト関数
function logout() {
    window.location.href = 'login.html';
    localStorage.clear();
}


//-------------3. ユーザー読み込み
function get_users() {
    // トークンがなかったらログイン画面に遷移
    if (!localStorage.token) {
        window.location.href = 'login.html';
    }

    //ログインしているユーザーのtokenを取得してヘッダーに格納する。
    myHeaders.append("Authorization", `Bearer ${localStorage.token}`);

    const requestOptions = {
        method: "GET",
        headers: myHeaders
    };

    fetch(urlUsers, requestOptions)
    .then(response => response.json())
        .then(json => {
            let userText = "";
            json.forEach(element => {
                userText += `<li>${element.name}</li>\n`;
            });
            document.querySelector('#users').innerHTML = userText;
        })
        .catch(error => console.log(`Error: ${error}`));
}

//------ 4.ユーザー編集
function edit() {
    // トークンがなかったらログイン画面に遷移
    if (!localStorage.token) {
        window.location.href = 'login.html';
    }

    //inputの内容取得
    const user_name = document.querySelector("#user_name").value;
    const user_bio = document.querySelector("#user_bio").value;

    //localStorageから値を取得
    const myId = localStorage.getItem('id');
    const urlEdit = `https://teachapi.herokuapp.com/users/${myId}`;

    //ヘッダ情報
    const myToken = localStorage.getItem('token');
    myHeaders.append("Authorization", `Bearer ${myToken}`);

    const BodyData = {
        "user_params": {
            "name": user_name,
            "bio": user_bio
        }
    }

    const myBody = JSON.stringify(BodyData);

    const requestOptions = {
        method: "PUT",
        body: myBody,
        headers: myHeaders
    }

    fetch(urlEdit, requestOptions)
    .then(response => response.json())
    .then(json => {
        localStorage.name = json.name,
        localStorage.bio = json.bio
        location.reload();
    })
    .catch(error => console.log(`Error: ${error}`));
}

//--------5.けす

function del() {
    // トークンがなかったらログイン画面に遷移
    if (!localStorage.token) {
        window.location.href = 'login.html';
    }

    //宣言
    const urlEdit = `https://teachapi.herokuapp.com/users/${localStorage.id}`;

    //ヘッダ情報
    const myToken = localStorage.getItem('token');
    myHeaders.append("Authorization", `Bearer ${myToken}`);

    const requestOptions = {
        method: "DELETE",
        headers: myHeaders
    }

    if(confirm("本当にけしますか？")) {
        fetch(urlEdit, requestOptions)
            .then(response => response.json())
            .then(json => {
                localStorage.clear();
                alert("ユーザーは消えました");
                window.location.href = 'login.html';
            })
            .catch(error => console.log(`Error: ${error}`));
    } else {
        console.log("消さない");
    }

}


//----------6.投稿作成

function new_text() {
    const urlNewText = "https://teachapi.herokuapp.com/posts";
    const text = document.querySelector("#text").value;

    //ヘッダ情報
    myHeaders.append("Authorization", `Bearer ${localStorage.token}`);

    const BodyData = {
        "post_params": {
            "text": text
        }
    }

    const myBody = JSON.stringify(BodyData);

    const requestOptions = {
        method: "POST",
        body: myBody,
        headers: myHeaders
    }

    fetch(urlNewText, requestOptions)
    .then(response => response.json())
    .then(json => {
        console.log(json);
        localStorage.text = `${json.id}:${json.text}`;
        localStorage.posted_id = json.id;
        window.location.href = 'users.html';
        alert(`${json.id}番で${json.text}と入力できました`);
    })
    .catch(error => console.log(`Error: ${error}`));
}

//----------- 7.タイムライン作成

function timeline() {
    // URL
    const urlTimeLine = `https://teachapi.herokuapp.com/users/${localStorage.id}/timeline`;
    //ヘッダ情報
    myHeaders.append("Authorization", `Bearer ${localStorage.token}`);

    const requestOptions = {
        method: "GET",
        headers: myHeaders
    }

    fetch(urlTimeLine, requestOptions)
        .then(response => response.json())
        .then(json => {
            let timeLine = "";
            json.forEach(element => {
            let test = JSON.stringify(element.id);
            timeLine += `${test}:<li>${element.text}</li>\n`;
            });
            document.querySelector('#timeline').innerHTML = timeLine;
        })
        .catch(error => console.log(`Error: ${error}`));
}


//後で
//---------- 8. 投稿編集

function edit_text() {

    const edit_text = document.querySelector("#edit_text").value;
    const edit_text_id = document.querySelector("#edit_text_id").value;
    const urlEditText = `https://teachapi.herokuapp.com/posts/${edit_text_id}`;

    //ヘッダ情報
    myHeaders.append("Authorization", `Bearer ${localStorage.token}`);

    const BodyData = {
        "post_params": {
            "text": edit_text
        }
    }

    const myBody = JSON.stringify(BodyData);


    const requestOptions = {
        method: "PUT",
        body: myBody,
        headers: myHeaders
    }

    // ここにURLとデータを入れれば編集してくれる
    fetch(urlEditText, requestOptions)
    .then(response => response.json())
    .then(json => {
        console.log(json);
        localStorage.text = json.text;
        location.reload();
    })
    .catch(error => console.log(`Error: ${error}`));

}


//------------- 9.投稿削除

function del_text() {

    const del_text = document.querySelector("#del_text").value;
    const urlDelText = `https://teachapi.herokuapp.com/posts/${del_text}`;

    myHeaders.append("Authorization", `Bearer ${localStorage.token}`);

    const requestOptions = {
        method: "DELETE",
        headers: myHeaders
    }

    fetch(urlDelText, requestOptions)
    .then(response => response.json())
    .then(json => {
        console.log(json);
        alert("指定されたidの投稿が削除されました。");
        localStorage.removeItem("text");
    })
    .catch(error => console.log(`Error: ${error}`));

}


//------------- 10. 皆の投稿(タイムライン)

function all_timeline() {

    const urlAllTimeLine = "https://teachapi.herokuapp.com/posts"

    myHeaders.append("Authorization", `Bearer ${localStorage.token}`);

    const requestOptions = {
        method: "GET",
        headers: myHeaders
    }

    fetch(urlAllTimeLine, requestOptions)
    .then(response => response.json())
    .then(json => {
        let timeLine = "";
        json.forEach(element => {
            timeLine += `<li>${element.user["name"]}さん(${element.user["id"]}): ${element.text}</li>\n`;
        });
        document.querySelector('#all_users').innerHTML = timeLine;
    })
    .catch(error => console.log(`Error: ${error}`));

}


// 戻るボタン
function back_users() {
    window.location.href = 'users.html';
}