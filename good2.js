/*
var memory_buttons = {
    "MC":"onclickMC",
    "MS":"onclickMS",
    "MR":"onclickMR"
}
*/
/* 메모리 연산용으로 만들었으나 레이아웃 때문에 안쓰기로 했음.
var memories_buttons = ["MC", "MS", "MR"];
*/
var erasers_buttons = ["CE", "C", "←"];
var numbers_buttons = [
    "7","8","9",
    "4","5","6",
    "1","2","3",
    "0","."];
var arithmetics_buttons = [
    "/",
    "*",
    "-",
    "+",
    "="];
//버튼 만들기
function create_buttons(div_id, buttons) {
    var target = document.getElementById(div_id);
    for(var i in buttons) {
        var element = document.createElement('button');
        element.innerText = buttons[i];
        element.className = "buttons";
        element.id = "button"+buttons[i];
        element.addEventListener("mousedown", on_mousedown);
        element.addEventListener("mouseup", on_mouseup);
        element.addEventListener("mouseover", on_mouseover);
        element.addEventListener("mouseout", on_mouseout);
        target.appendChild(element);
    }
};
var testingfunction = function(event) {
    event.preventDefault();
}
// 윈도우 로딩시 초기화 함수 진행
window.addEventListener("load", function(event) {
    init_cal();
    var element = document.getElementsByClassName('buttons');
    // 기본 버튼 rgb 확인
    rgb = split_rgb(getComputedStyle(element[0]).backgroundColor);
});
// 버튼에 마우스 오버, 아웃, 클릭 등에 따라 배경색 바꾸기
var rgb;                // 기본 배경색, 1, 2단계로 나뉨
var rgb_level = -25;    // 단계별 증감값
var rgb_scalar = 0;     // 단계 결정값

// rgb 값이 예시와 같이(String) 오는데, 이를 정수화하여 리스트화
// 예시 "rgb( 250, 100, 20)""
var split_rgb = function(source) {
    var result = [];
    var splitted = source.split('(');
    splitted = splitted[1].split(')');
    splitted = splitted[0].split(',');
    result.push(parseInt(splitted[0]), parseInt(splitted[1]), parseInt(splitted[2]));

    return result;
}
// bg 설정 함수
var set_bg = function(button) {
    var element = "";
    element = document.getElementById(button.target.id);
    // amount of change 변화량
    // 설정한 증감값에, 레벨을 곱해서 최종적인 변화량을 결정
    var aoc = rgb_level * rgb_scalar;
    element.style.backgroundColor = "rgb("+(rgb[0]+aoc).toString()+","+(rgb[1]+aoc).toString()+","+(rgb[2]+aoc).toString()+")";
}

// 이하 mousedown~mouseout까지 이벤트 함수
// 각 변수들은 다른 함수에서도 해당 이벤트가 발생한 타겟을 확인할 변수
var mousedowned = "";
var mouseupped = "";
var mouseoverred = "";
var mouseoutted = "";
var on_mousedown = function(event) {
    mousedowned = event.target.id;
    // 마우스 오버 후 마우스 다운시 2단계
    rgb_scalar = 2;
    set_bg(event);
}
var on_mouseup = function(event) {
    mouseupped = event.target.id;
    // 마우스 업일 경우 마우스 오버중이므로 1단계
    rgb_scalar = 1;
    set_bg(event);
    // 버튼 클릭시 (마우스 다운 후 다른 버튼에서 발동하지 않도록)
    if(mousedowned === mouseupped) {
        classify_button(event);
    }
    mousedowned = "";
}
var on_mouseover = function(event) {
    mouseoverred = event.target.id;
    // 마우스 오버시 배경 변경
    if(mousedowned != "") {
        if(mouseoverred === mousedowned) {
            rgb_scalar = 2;
        } else if(mouseoverred != mousedowned) {
            rgb_scalar = 0;
        }
    } else {
        rgb_scalar = 1;
    }
    set_bg(event);
}
var on_mouseout = function(event) {
    // 마우스 아웃시 배경 변경
    mouseoutted = event.target.id;
    rgb_scalar = 0;
    set_bg(event);
}
// 버튼 클릭시 구분
var classify_button = function(event) {
    var key = event.target.innerText;
    // 지우기 버튼(CE, C, 백스페이스) 분류
    for(var i=0;i < erasers_buttons.length; i++) {
        if(key === erasers_buttons[i]) {
            if(key === "←") {
                backspace_listener()
            } else {
                clear_listener(key);
            }
            return 0;
        }
    }
    // 숫자 분류
    for(var i=0; i<numbers_buttons.length; i++) {
        if(key === numbers_buttons[i]) {
            // 소수점을 제외한 입력
            if(key != "."){
                number_listener(key);
            } else { // 소수점 입력될 경우
                decpoint_listener(key);
            }
            return 0;
        }
    }
    // 사칙연산 및 등호 분류
    for(var i=0; i<arithmetics_buttons.length; i++) {
        if(key === arithmetics_buttons[i]){
            if(key != "=") {
            arithmetics_listener(key);
            }// 등호 분류
            else if(key === "=") {
                equal_listener("=");
            }
            return 0;
        }
    }
}
//키보드 이벤트 발생시 1차처리
var pushed_key = "";
var on_keydown = function(event) {
    var keyName = event.key;
    checkkeys(keyName);
}
var checkkeys = function(keyName) {
    // 숫자 분류
    for(var i in numbers_buttons) {
        if(keyName === numbers_buttons[i]) {
            // 소수점을 제외한 입력
            if(keyName != "."){
                number_listener(keyName);
            } else { // 소수점 입력될 경우
                decpoint_listener(keyName);
            }
        }
    }
    // 사칙연산 분류
    for(var i in arithmetics_buttons) {
        if(keyName === arithmetics_buttons[i] && keyName != "="){
            arithmetics_listener(keyName);
        }
    }
    // 등호 처리
    if(keyName === "Enter" || keyName === "=") {
        equal_listener("=");
    }
    // 백스페이스 처리
    if(keyName === "Backspace") {
        backspace_listener();
    }
}
// 피연산자
var operand = "";           // 첫번째 피연산자
var second_operand = "";    // 두번째 피연산자
var init_flag = 1;          // 처음 입력하는 수인지 확인
var having_point = 0;       // 소수점을 가지고 있는지 여부
// 연산자 변수
var operator = "";          // 연산자(사칙연산)
var last_operator = "";     // 마지막 연산

// 초기화 함수(경로 사용을 용이하게)
var subdp = null;
var maindp = null;
var init_cal = function() {
    subdp = document.getElementById('dp_sub');
    maindp = document.getElementById('dp_main');
}
/*
    [이슈리스트]
    Closed 1. 0이 계속 들어올때 0000...으로 들어오는 현상
    Closed 2. 5+10 엔터 후 "-" 누르면 에러
    Closed 3. 연산자는 있는데 피연산자 2가 없으면 연산안해줌.
    Closed 4. 5000+5000 엔터 연속후 0누르면 초기화안해줌
    Closed 5. 갑자기 10000, 5000씩 뜨는 이상한 버그가 있음. (0이 뭔가.. 특정상황(200+200 식을 넣고 0을 입력하면 식이 사라질때)에 계속 추가되는듯 보임)
        [재현]
        1. 100 + 100 을 계속 함
        2. 한 1000 쯤까지 함
        3. 0을 누름(꼭 0이어야함)
        4. 0으로 되돌아가는걸 확인
        5. 100이나 뭐 50정도 다시 입력
        6. 엔터누르면? 에러
    Closed 6. second_operand 입력 타이밍에 0000000000을 계속 넣을 수 있음
    Closed 7. 100+100... 1000까지 넣고  마이너스 0하면 연산안됨(3번 구현하면 될것같기도함)
    [아이디어]
    1. 오퍼랜드는 연산시에만 중요하다. 결국 숫자를 입력할 때에는 그냥 숫자만찍어주면 된다. 그니까 number_listener에서 오퍼랜드를 가지고 놀 필요가 없다.
*/
// 숫자 리스너
var number_listener = function(key) {
    if(init_flag === 1) {
        maindp.value = key;
        if(key != 0){
            init_flag = 0;
        }
        if(second_operand != "") {
            subdp.value = "";
        }
    } else {
        maindp.value += key;
    }
}
// 사칙연산 리스너
var arithmetics_listener = function(key) {
    operator = key;
    // 피연산자 2가 있을 경우
    if(operand != "" && init_flag === 0) {
        // 여기서 연산해야함
        maindp.value = arithmetic(operand, maindp.value, last_operator);
        last_operator = "";
    }
    change_dpsub();
}
// 등호 리스너
var equal_listener = function(key) {
   if(operator === ""){
       change_dpsub("=");
       init_flag = 1;
    } else if(operand != "" && operator != "") {
        second_operand = maindp.value;
        change_dpsub("=");
    } else if(operand === "" && operator != "") {
        operand = maindp.value;
        change_dpsub("=");
    }
}
// 소숫점(Decimal point) 리스너
var decpoint_listener = function(key) {
    if(having_point === 0 && init_flag === 1) {
        maindp.value = "0" + key;
        having_point = 1;
        init_flag = 0;
    } else if(having_point === 0 && init_flag === 0) {
        maindp.value += key;
        having_point = 1;
    }
}
// 결과 지우기(CE, C) 리스너
var clear_listener = function(key) {
    if(key != "CE") {
        second_operand = "";
        operator = "";
        last_operator = "";
    }
    subdp.value = "";
    maindp.value = "0";
    operand = "";
    init_flag = 1;
    having_point = 0;
}
// 백스페이스 리스너
var backspace_listener = function() {
    var len = maindp.value.length;
    if(init_flag === 0 && len > 1) {
        // 혹시 소수점을 지웠다면 다시 소수점 없음으로 설정.
        if(maindp.value[len-1] === ".") {
            having_point = 0;
        }
        maindp.value = maindp.value.substr(0, len-1);
    } else if(init_flag === 0 && len === 1) {
        maindp.value = "0"
        init_flag = 1;
        // 세컨드 오퍼랜드가 있으면 입력시 subdp 초기화
    } else if(init_flag === 1 && second_operand != "") {
        subdp.value = "";
    }
}
// 서브 디스플레이(수식을 표기하는 화면) 설정
var change_dpsub = function(symbol) {
    if(symbol === "=" && operator === "") {
        operand = "";
        maindp.value = parseFloat(maindp.value).toString();
        subdp.value = maindp.value + symbol;
    } else if(symbol === "=" && operator != "") {
        subdp.value = operand + operator + second_operand + symbol;
        maindp.value = arithmetic(operand, second_operand, operator);
        operand = "";
    } else {
        maindp.value = parseFloat(maindp.value).toString();
        operand = maindp.value;
        subdp.value = operand + operator;
        second_operand = "";
        last_operator = operator;
    }
    init_flag = 1;
    having_point = 0;
}
// 사칙연산 후 반환
var arithmetic = function(num1, num2, operator) {
    switch (operator) {
        case "/":
            result = parseFloat(num1)/parseFloat(num2);
            break;
        case "*":
            result = parseFloat(num1)*parseFloat(num2);
            break;
        case "-":
            result = parseFloat(num1)-parseFloat(num2);
            break;
        case "+":
            result = parseFloat(num1)+parseFloat(num2);
            break;
    }
    return result;
}
// 문서에 키다운 이벤트 설정
document.addEventListener('keydown', on_keydown);

//프리테스팅
var list = {
    "10":"열",
    "20":"스물",
    "30":"서른"
};
var list2 = ["10", "20", "30"];
var list3 = ["40", "50", "60"];
var list4 = list2.concat(list3);
for(var i=0; i < numbers_buttons.length; i++){
}
/*
var text = "1234.";
var text = text.substr(0, 4);
console.log(text);
document.getElementById('dp_sub').value = 3
*/