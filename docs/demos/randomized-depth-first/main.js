

const canvas = document.getElementById("maze_canvas");
const ctx = canvas.getContext('2d');

// this defines the number of pixels in the canvas
// the style sheet defines the size
canvas.width = 480;
canvas.height = 320;

let nx = 6;
let ny = 4;
let dx = 10; // should be even
let dy = 10; // sould be even
let rooms = {};

let room_h = 0.8;
let room_w = 0.8;
let walls = new Map();
let wall_l = 0.8;
let wall_t = 0.2;

window.addEventListener('load', ()=> {
        //document.addEventListener('keydown', process_keydown);
        //document.addEventListener('keyup', process_keyup);
	
	build_room_network();

	iterate();
})


// draw a rectangle based on our scaling system
function draw_rect(rect) {
	ctx.fillRect((rect.x + 0.5 - rect.w/2)*dx, (rect.y + 0.5 - rect.h/2)*dy, rect.w*dx, rect.h*dy);
}

// take two room id numbers to generate a wall id string
function wall_id(r_id_1, r_id_2) {
	// assume room_1 
	if (r_id_1 > r_id_2) {
		console.log("please reverse the order of the rooms");
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
					{x: xx+0.5, y: yy, h: wall_l, w: wall_t, visited: 0});
			}
			if (yy != 0) {
				neighs.push(room_id - nx);
			}
			if (yy != ny-1) {
				neighs.push(room_id + nx);
				walls.set(wall_id(room_id, room_id+nx),
					{x: xx, y: yy+0.5, h: wall_t, w: wall_l, visited: 0});
			}
			rooms[room_id++] = {x: xx, y: yy, h: room_h, w: room_w, visited: 0, neighbors: neighs};
		}
	}
}



function iterate() {

	// clear
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	// draw paths
	ctx.fillStyle = 'white';


	//ctx.fill();
	

	draw_rect(rooms[10]);
	draw_rect(rooms[11]);
	draw_rect(rooms[17]);

	
	draw_rect(walls.get("10,11"));
	draw_rect(walls.get("11,17"));


}


