let weekday = 5;
let weekend = 2;
let week = 7;
let shift = [];
let members = []; // 나중에 엑셀 연결 해서 가져옴
let memberTotal = members.length;

function work(score, cnt) // 파라미터 이름 추가
{
    this.score = score;
    this.count = cnt;
}

for(let i = 0; i < week; i++)
{
    let numberNightShift = 4; // 불침번 근무 개수
    let numberCctvShift = 10; // cctv 근무 개수
    let shiftsTotal = numberNightShift + numberCctvShift
    shiftsTotal = (i < weekday) ? shiftsTotal : shiftsTotal + 2; // 주말 위병소 근무 때문에
    shift[i] = new Array(shiftsTotal);
    for(let j = 0; j < shiftsTotal; j++) // 모든 근무 점수 카운트 초기화
    {
        shift[i][j] = new work(0, 1);
    }
    for(let k = 10; k < shiftsTotal; k++) // 불침번 근무 점수 설정
    {
        shift[i][k].score = (i == 4 || i == 5) ? 0 : 5; // 금,토 불침번은 0점 으로 설정
    }
    shift[i][7].score = 5; // shift[i][7]는 18~20이고, 매일 5점 짜리 근무임
}
console.log(shift);

function loadMembers()
{
    for(let i = 0; i < memberTotal; i++)
    {
        members[i] = i;
        members[i] = new work(0, 0);
    }
}
loadMembers();

// *** 멤버들의 점수와 근무 횟수 초기화


