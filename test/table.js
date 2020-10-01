/*
function cellStandard()
{
    
}

function addTag() 
{
    for(let i = 0; i < sentences[nowString].length; i++)
    {
      let node = document.createElement('span');
      node.id = i;
      let txtNode = document.createTextNode(sentences[nowString][i]);
      node.appendChild(txtNode);
      outputTxt.appendChild(node);
    }
}

function createTable()
{

}
*/

let yoill = ["Mon", "Tue", "Wed", "Thr", "Fri", "Sat", "Sun"];

for(let i = 0; i < yoill.length; i++)
{
    week[i] = document.querySelectorAll(yoill[i]);
}
