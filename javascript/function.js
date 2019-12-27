
function headerNew() {
    return new Headers();
}

//ヘッダーにjsonの情報を挿入する
function jsonAppendHeader(header) {
   return header.append("Content-Type", "application/json");
}