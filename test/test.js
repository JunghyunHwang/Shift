let weekday = 5;
let weekend = 2;
let week = 7;

let nightShift = [];
let yoill = ["Mon", "Tue", "Wed", "Thr", "Fri", "Sat", "Sun"];

function nightShiftScoreInitialization(day, score)
{
    for(let i = 0; i < day; i++)
    {
        nightShift[yoill[i]] = 
        {
            first : 
            {
                score : score,
                count : 1
            },
            second : 
            {
                score : score,
                count : 1
            },
            third : 
            {
                score : score,
                count : 1
            },
            fourth : 
            {
                score : score,
                count : 1
            }
        }
    }
}

nightShiftScoreInitialization(week, 5);
nightShiftScoreInitialization(weekend, 0);

console.log(nightShift);
// 1. 근무 짜자
// 2. 그날 인원 데이터 가져와
// 3. 점수 별로 배열에 담아

var person = {
    name: ['Bob', 'Smith'],
    age: 32,
    gender: 'male',
    interests: ['music', 'skiing'],
    bio: function() {
      alert(this.name[0] + ' ' + this.name[1] + ' is ' + this.age + ' years old. He likes ' + this.interests[0] + ' and ' + this.interests[1] + '.');
    },
    greeting: function() {
      alert('Hi! I\'m ' + this.name[0] + '.');
    }
};