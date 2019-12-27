// デバック用
const p = console.log;

//よく使う関数

// APIのURL
const urlSignUp = "https://teachapi.herokuapp.com/sign_up";
const urlSignIn = "https://teachapi.herokuapp.com/sign_in";
const urlUsers = "https://teachapi.herokuapp.com/users";



//---------1.新規作成
function sign_up() {
    // Headersの用意
    const myHeaders = new Headers();
    // Headersにjsonを読み込むものを挿入
    myHeaders.append("Content-Type", "application/json");

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
            window.location.href = 'all_time_line.html';
        })
        .catch(error => console.error(`Error: ${error}`));
}


//------------2.ログイン関数
function login_user() {
    // Headersの用意
    const myHeaders = new Headers();
    // Headersにjsonを読み込むものを挿入
    myHeaders.append("Content-Type", "application/json");

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
            if (!json.token) {
                alert("存在しないアカウントです。");
                window.location.href = './login.html';
            } else {
                console.log("ログイン中です");
                localStorage.token = json.token;
                localStorage.id = json.id;
                localStorage.name = json.name;
                localStorage.bio = json.bio;
                window.location.href = 'all_time_line.html';
            }
        })
        .catch(error => console.log(`Error: ${error}`));
}


//------------ログアウト関数
function logout() {
    localStorage.clear();
    alert("ログアウトしました")
    window.location.href = 'login.html';
}




//-------------3. ユーザー読み込み
function get_users() {
    // Headersの用意
    const myHeaders = new Headers();
    // Headersにjsonを読み込むものを挿入
    myHeaders.append("Content-Type", "application/json");

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
                userText += `<li class="user">
                                <div class="user_element">
                                ${element.id}:${element.name}
                                </div>
                                <div class="user_element">
                                    <div class="sign_up margin_reset"><a onclick="follow(${element.id})">フォローする</a></div>
                                </div>
                             </li>\n`;
            });
            document.querySelector('#users').innerHTML = userText;
        })
        .catch(error => console.log(`Error: ${error}`));
}

//------ 4.ユーザー編集
function edit() {
    // Headersの用意
    const myHeaders = new Headers();
    // Headersにjsonを読み込むものを挿入
    myHeaders.append("Content-Type", "application/json");

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
        window.location.href = 'users.html';
    })
    .catch(error => console.log(`Error: ${error}`));
}

//--------5.けす

function del() {
    // Headersの用意
    const myHeaders = new Headers();
    // Headersにjsonを読み込むものを挿入
    myHeaders.append("Content-Type", "application/json");

    // トークンがなかったらログイン画面に遷移
    if (!localStorage.token) {
        window.location.href = 'login.html';
    }

    //宣言
    const urlEdit = `https://teachapi.herokuapp.com/users/${localStorage.id}`;

    //ヘッダ情報
    myHeaders.append("Authorization", `Bearer ${localStorage.token}`);

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
    // Headersの用意
    const myHeaders = new Headers();
    // Headersにjsonを読み込むものを挿入
    myHeaders.append("Content-Type", "application/json");

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
        localStorage.text = `最新の投稿:${json.id}:${json.text}`;
        localStorage.posted_id = json.id;
        window.location.href = 'all_time_line.html';
    })
    .catch(error => console.log(`Error: ${error}`));
}

//----------- 7.タイムライン作成

function timeline() {
    // Headersの用意
    const myHeaders = new Headers();
    // Headersにjsonを読み込むものを挿入
    myHeaders.append("Content-Type", "application/json");

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
            timeLine += `${test}:<li class="user">${element.text}</li>\n`;
            });
            document.querySelector('#timeline').innerHTML = timeLine;
        })
        .catch(error => console.log(`Error: ${error}`));
}


//---------- 8. 投稿編集

function edit_text() {
    // Headersの用意
    const myHeaders = new Headers();
    // Headersにjsonを読み込むものを挿入
    myHeaders.append("Content-Type", "application/json");

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
        window.location.href = 'edit_user.html';
    })
    .catch(error => console.log(`Error: ${error}`));
}


//------------- 9.投稿削除

function del_text() {
    // Headersの用意
    const myHeaders = new Headers();
    // Headersにjsonを読み込むものを挿入
    myHeaders.append("Content-Type", "application/json");

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
        localStorage.removeItem("text");
        window.location.href = 'edit_user.html';
    })
    .catch(error => console.log(`Error: ${error}`));
}


//------------- 10. 皆の投稿(タイムライン)

function all_timeline() {
    // Headersの用意
    const myHeaders = new Headers();
    // Headersにjsonを読み込むものを挿入
    myHeaders.append("Content-Type", "application/json");

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
    window.location.href = 'all_time_line.html';
}


//11.フォロー関数
function follow(id) {

    const url = `https://teachapi.herokuapp.com/users/${id}/follow`;
    // Headersの用意
    const myHeaders = new Headers();
    // Headersにjsonを読み込むものを挿入
    myHeaders.append("Content-Type", "application/json");

    //ログインしているユーザーのtokenを取得してヘッダーに格納する。
    myHeaders.append("Authorization", `Bearer ${localStorage.token}`);


    const requestOptions = {
        method: "POST",
        headers: myHeaders
    };

    fetch(url, requestOptions)
        .then(console.log("フォロー完了"));
}


// 12. アンフォロー関数
function unfollow(id) {
    const url = `https://teachapi.herokuapp.com/users/${id}/follow`;

    // Headersの用意
    const myHeaders = new Headers();
    // Headersにjsonを読み込むものを挿入
    myHeaders.append("Content-Type", "application/json");
    //ログインしているユーザーのtokenを取得してヘッダーに格納する。
    myHeaders.append("Authorization", `Bearer ${localStorage.token}`);

    const requestOptions = {
        method: "DELETE",
        headers: myHeaders
    };

    fetch(url, requestOptions)
        .then(console.log("フォロー解除"));
}

// 13 フォロワー表示
function get_follow() {
    const url = `https://teachapi.herokuapp.com/users/${localStorage.id}/followings`;

    // Headersの用意
    const myHeaders = new Headers();
    // Headersにjsonを読み込むものを挿入
    myHeaders.append("Content-Type", "application/json");
    //ログインしているユーザーのtokenを取得してヘッダーに格納する。
    myHeaders.append("Authorization", `Bearer ${localStorage.token}`);

    const requestOptions = {
        method: "GET",
        headers: myHeaders
    };

    fetch(url, requestOptions)
        .then(response => response.json())
        .then(json => {
            let userText = "";
            json.forEach(element => {
                userText += `<li class="user">
                                <div class="user_element">
                                ${element.name}
                                </div>
                                <div class="user_element">
                                    <div class="sign_up margin_reset"><a onclick="unfollow(${element.id})">フォロー解除</a></div>
                                </div>
                             </li>\n`;
            });
            document.querySelector('#your-follow').innerHTML = userText;
        })
        .catch(error => console.log(`Error: ${error}`));
}

// 14,フォロワー
function get_follower() {
    url = `https://teachapi.herokuapp.com/users/${localStorage.id}/followers`;

    // Headersの用意
    const myHeaders = new Headers();
    // Headersにjsonを読み込むものを挿入
    myHeaders.append("Content-Type", "application/json");
    //ログインしているユーザーのtokenを取得してヘッダーに格納する。
    myHeaders.append("Authorization", `Bearer ${localStorage.token}`);

    const requestOptions = {
        method: "GET",
        headers: myHeaders
    };

    fetch(url, requestOptions)
        .then(response => response.json())
        .then(json => {
            let userText = "";
            json.forEach(element => {
                userText += `<li class="user">
                                <div class="user_element">
                                ${element.name}
                                </div>
                             </li>\n`;
            });
            document.querySelector('#your-follower').innerHTML = userText;
        })
        .catch(error => console.log(`Error: ${error}`));
}