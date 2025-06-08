

const canvas = document.getElementById("maze_canvas");
const ctx = canvas.getContext('2d');

const next_button = document.getElementById("next_button");
const play_button = document.getElementById("play_button");
const pause_button = document.getElementById("pause_button");

const reset_button = document.getElementById("reset_button");

// this defines the number of pixels in the canvas
// the style sheet defines the size
canvas.width = 480;
canvas.height = 320;

// maze size and rescaling
let dx = 32; // should be even
let dy = 32; // sould be even

let nx = canvas.width / dx;
let ny = canvas.height / dy;

let rooms = {};
let walls = new Map();

// sizes relative to one maze unit
let room_h = 0.75;
let room_w = 0.75;
// instad of setting these, calculate them on the fly
let wall_l = 0.75;
let wall_t = 0.25;

// for now track the 'current' room you are in
// set to -1 to signify it has not been initialized
let last_room = -1;
let current_room = -1;

let history = [];

let play_forward = false;


window.addEventListener('load', ()=> {
        //document.addEventListener('keydown', process_keydown);
        //document.addEventListener('keyup', process_keyup);

	reset_button.addEventListener("click", reset_maze);
	next_button.addEventListener("click", iterate_forward);
	play_button.addEventListener("click", hey);
	pause_button.addEventListener("click", pause);
	

	build_room_network();

	reset_maze();
})


// draw a rectangle based on our scaling system
function draw_rect(rect) {
	ctx.fillRect((rect.x + 0.5 - rect.w/2)*dx, (rect.y + 0.5 - rect.h/2)*dy, rect.w*dx, rect.h*dy);
}

// take two room id numbers to generate a wall id string
function wall_id(r_id_1, r_id_2) {
	// assume room_1 
	if (r_id_1 > r_id_2) {
		// cool one liner
		r_id_2 = [r_id_1, r_id_1 = r_id_2][0];
	}
	return (r_id_1.toString() + "," + r_id_2.toString());
}

// creates a relationship between all rooms and generates walls
function build_room_network() {
	// create all the rooms
	let room_id = 0;
	for (yy = 0; yy < ny; yy++) {
		for (xx = 0; xx < nx; xx++) {
			// add a room
			rooms[room_id] = {x: xx, y: yy};
			// might as well define the neighbors now
			neighs = [];
			if (xx != 0) {
				neighs.push(room_id - 1);
			}
			if (xx != nx-1) {
				neighs.push(room_id + 1);
				walls.set(wall_id(room_id, room_id+1), 
					{x: xx+0.5, y: yy, h: wall_l, w: wall_t, visits: 0});
			}
			if (yy != 0) {
				neighs.push(room_id - nx);
			}
			if (yy != ny-1) {
				neighs.push(room_id + nx);
				walls.set(wall_id(room_id, room_id+nx),
					{x: xx, y: yy+0.5, h: wall_t, w: wall_l, visits: 0});
			}
			rooms[room_id++] = {x: xx, y: yy, h: room_h, w: room_w, visits: 0, neighbors: neighs};
		}
	}
}


function reset_maze() {
	console.log('resetting maze');

	// clean the canvas
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	// set all visited stats to zero
	
	for (let room_id=0; room_id < nx*ny; room_id++) {
		rooms[room_id].visits = 0;
	}

	for (let [wall_id, wall] of walls) {
		wall.visits = 0;
	}


	// initialize the maze
	current_room = Math.floor(Math.random()*nx*ny);
	rooms[current_room].visits++;

	// draw the initial thing
	ctx.fillStyle = 'red';
	draw_rect(rooms[current_room]);

	history = [current_room];
	console.log('done resetting maze');
}



function get_unvisited_rooms(check) {
	let temp_list = [];
	for(let rr =0; rr < check.length; rr++) {
		if (rooms[check[rr]].visits == 0) {
			temp_list.push(check[rr]);
		}
	}
	return temp_list
}



function iterate_forward() {
	last_room = current_room;

	// select the next neighbor
	// 'random' select
	let unvisited = get_unvisited_rooms(rooms[current_room].neighbors);
	//console.log('unvisited');
	//console.log(unvisited);
	if (unvisited.length > 0) {
		current_room = unvisited[Math.floor(Math.random() * unvisited.length)];
		history.push(last_room);
	}
	else if (history.length > 1) {
		//console.log('time to backtrack!');
		//console.log('popping history')
		current_room = history.pop();
	}
	else {
		console.log('Done!');
		play_forward = false;
		return
	}

	rooms[current_room].visits++;
	walls.get(wall_id(last_room, current_room)).visits++;

	//console.log(current_room);

	// draw
	ctx.fillStyle = 'white';

	// iterate through all or apply the delta
	for (let room_id = 0; room_id < nx*ny; room_id++) {
		if (rooms[room_id].visits > 0) {
			draw_rect(rooms[room_id]);
		}
	}

	for (let [wall_id, wall] of walls) {
		if (wall.visits > 0) {
			draw_rect(wall);
		}
	}

	ctx.fillStyle = 'red';
	draw_rect(rooms[current_room]);

	//console.log(history);
	//
	if (play_forward) {
		window.requestAnimationFrame(iterate_forward);
	}
}

function pause() {
	play_forward = false;
}

function hey() {
	play_forward = true;
	window.requestAnimationFrame(iterate_forward);
}
