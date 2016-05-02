var notid = 'blt9a701cab853afe58'
var a = [
  {
    "title": "React Base Fiddle (JSX)",
    "description": "test notification description",
    "uid": "blt9a701cab853afe58",
    "status": false
  },
  {
    "status": false,
    "uid": "blt069954f9f54753c2",
    "description": "demo1",
    "title": "demo1"
  }
]




a.map(function(elem) {
  if(elem.uid === notid){
    elem.status = true
  }
})

console.log(a)