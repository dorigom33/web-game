/**
 * 상단 버튼 js
 */
const url = window.location.pathname;
const team = url.split('/')[1];

function buttonRender(team){
	let html = '';
	const buttonText = team.toUpperCase();
	html+='<button class="btn-home" onclick="location.href=\'/\'">HOME</button>';
    html+='<button class="btn-team" onclick="location.href=\'/' + team + '/\'">'+ buttonText + '</button>';

    let button = document.querySelector('#button');
    button.innerHTML=html;
}

buttonRender(team);