var grid = '';

var gridHeight = 103; // units
var gridWidth = 103; // units
var cellSize = 5; // pixels

var gridCanvas = '';
var gridContext = '';
var gameCanvas = '';
var gameContext = '';

var tickCount = 0;
var tickExecutionTotal = 0;
var tickAverage = 0;

function initGrid(seed) {
	grid = [];
	// Assemble grid 
	for (var rows = 0; rows < gridHeight; rows++){
		var rowArr = [];
		for (var cols = 0; cols < gridWidth; cols++) {
			rowArr.push([rows,cols]);
		};
		grid.push(rowArr);
	}

	// Render grid - https://github.com/enterprisebug/grid.js
	$("canvas").remove();
	gridCanvas = $('<canvas id="gridCanvas" />').attr({width: (gridHeight*cellSize)+1, height: (gridWidth*cellSize)+1}).appendTo('#grid');
	gridContext = gridCanvas.get(0).getContext("2d");
	var opts = {
		distance : cellSize,
		lineWidth : 1,
		gridColor  : "#CCC",
		caption : false
	};
	new Grid(opts).draw(gridContext);

	// Prepare game canvas
	gameCanvas = $('<canvas id="gameCanvas" />').attr({width: (gridHeight*cellSize)+1, height: (gridWidth*cellSize)+1}).appendTo('#grid');
	gameContext = gameCanvas.get(0).getContext("2d");

	// Set initial state
	$.each(seed,function(index,cell) {
		var row = cell[0];
		var col = cell[1];
		grid[row][col].push('live');
		drawGameCell(row,col);
	});
}

function tick() {
	tickCount++
	var start = new Date().getTime();

	// Clear game canvas
	gameContext.clearRect(0, 0, (gridWidth*cellSize)+1, (gridHeight*cellSize)+1);

	// Create temporary grid for next generation
	var tempGrid = [];

	for (var rows = 0; rows < gridHeight; rows++) {
		tempGrid[rows] = [];
		for (var cols = 0; cols < gridWidth; cols++) {
			var cell = grid[rows][cols];
			// Retrieve cell neighbours
			liveCellNeighbours = getLiveCellNeighboursCount(rows,cols);
			tempGrid[rows][cols] = [rows,cols,'live'];
			if (cell[2] !== undefined ) {	// This is a live cell
				if (liveCellNeighbours < 2){
					// Live cell with fewer than two live neighbours dies, as if caused by under-population.
					delete tempGrid[rows][cols][2];
				}else{
					if (liveCellNeighbours == 2 || liveCellNeighbours == 3) {
						// Live cell with two or three live neighbours lives on to the next generation.
						drawGameCell(rows,cols);
					}else{
						// Live cell with more than three live neighbours dies, as if by overcrowding.
						delete tempGrid[rows][cols][2];
					}
				}
			}else {
				if (liveCellNeighbours == 3) {
					// Dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.
					drawGameCell(rows,cols);
				}else{
					delete tempGrid[rows][cols][2];
				}
			}
		};
	}
	// Dump temporary grid back to real grid
	grid = tempGrid;

	// Calculate average execution time and total generation
	var end = new Date().getTime();
	var executionTime = parseFloat(((end-start) / 1000 ).toFixed(3));
	tickExecutionTotal += executionTime;
	var tickAvg = (tickExecutionTotal / tickCount).toFixed(3);
	$("#tickAvg").text(tickAvg);
	$("#generations").text(tickCount);
}

function drawGameCell(row,col) {
	var x = (row * cellSize);
	var y = (col * cellSize);
	gameContext.fillRect(x,y,cellSize,cellSize);
}


function getLiveCellNeighboursCount(row,col) {
	var cells = 0;
	var cell = [];
	var r = 0;
	var c = 0;

	// upper 3
	// +---+---+---+
	// | X | X | X |
	// | 0 | ■ | 0 |
	// | 0 | 0 | 0 |
	// +---+---+---+
	r = row - 1;
	c = col - 1;
	try{
		if (grid[r][c][2] == 'live') {
			cells++;
		}
	}catch(e) {}
	r = row - 1;
	c = col;
	try{
		if (grid[r][c][2] == 'live') {
			cells++;
		}
	}catch(e) {}
	r = row - 1;
	c = col + 1;
	try{
		if (grid[r][c][2] == 'live') {
			cells++;
		}
	}catch(e) {}

	// sides
	// +---+---+---+
	// | 0 | 0 | 0 |
	// | X | ■ | X |
	// | 0 | 0 | 0 |
	// +---+---+---+
	r = row;
	c = col + 1;
	try{
		if (grid[r][c][2] == 'live') {
			cells++;
		}
	}catch(e) {}
	r = row;
	c = col - 1;
	try{
		if (grid[r][c][2] == 'live') {
			cells++;
		}
	}catch(e) {}

	// lower 3
	// +---+---+---+
	// | 0 | 0 | 0 |
	// | 0 | ■ | 0 |
	// | X | X | X |
	// +---+---+---+
	r = row + 1;
	c = col - 1;
	try{
		if (grid[r][c][2] == 'live') {
			cells++;
		}
	}catch(e) {}
	r = row + 1;
	c = col;
	try{
		if (grid[r][c][2] == 'live') {
			cells++;
		}
	}catch(e) {}
	r = row + 1;
	c = col + 1;
	try{
		if (grid[r][c][2] == 'live') {
			cells++;
		}
	}catch(e) {}
	return cells;
}

function clearGrid() {
	grid = [];
	tickExecutionTotal = tickCount = 0;
	gameContext.clearRect(0, 0, (gridWidth*cellSize)+1, (gridHeight*cellSize)+1);
	initGrid(gridSeed);
}
