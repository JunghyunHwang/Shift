let numbers = [];
for(i = 0; i < 5; i++){
    numbers[i] = Math.floor(Math.random() * 8) + 1;
    for(j = 0; j < i; j ++){
        if(numbers[i] == numbers[j]){
            i--; // i를 앞으로 민다
            break; // 다음 것을 검색할 필요가 없으므로 중복검사 반복을 나갑니다.
        }
    }
}
console.log(numbers);