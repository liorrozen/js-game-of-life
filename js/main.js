var liveCells = {};
var deadCells = {};

var gridHeight; // units
var gridWidth; // units
var cellSize; // pixels

var gridCanvas = '';
var gridContext = '';
var gameCanvas = '';
var gameContext = '';

var tickCount = 0;
var tickExecutionTotal = 0;
var tickAverage = 0;
var doTick = false;

function initGrid(seed) {

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
		liveCells[row+'_'+col] = 1;
		drawGameCell(row,col);
	});
}

function tick() {
		tickCount++
			var start = new Date().getTime();

		// Clear game canvas
		gameContext.clearRect(0, 0, (gridWidth*cellSize)+1, (gridHeight*cellSize)+1);

		// Clear deadCells
		deadCells = [];

		// Create temporary grid for next generation
		var tempLiveCells = {};

		for (cell in liveCells){
			cellArr = cell.split('_');
			rows = cellArr[0];
			cols = cellArr[1];

			var newCell = [rows,cols,'live'];
			var isLive = true;

			// Retrieve cell neighbours
			liveCellNeighbours = getCellNeighboursCount(true,rows,cols);
			if (liveCellNeighbours < 2){
				// Live cell with fewer than two live neighbours dies, as if caused by under-population.
				isLive = false;
			}else{
				if (liveCellNeighbours == 2 || liveCellNeighbours == 3) {
					// Live cell with two or three live neighbours lives on to the next generation.
					drawGameCell(rows,cols);
				}else{
					// Live cell with more than three live neighbours dies, as if by overcrowding.
					isLive = false;
				}
			}

			if (isLive){
				// filters out all non Number values and adds to tempLiveCells
				tempLiveCells[rows+'_'+cols] = 1;
			}else{
				newCell = newCell.filter(Number);
			}
		}


		// go over all relevant dead cells
		var tempDeadCells = deadCells;
		for (cell in tempDeadCells){
			cellArr = cell.split('_');
			rows = cellArr[0];
			cols = cellArr[1];
			liveCellNeighbours = getCellNeighboursCount(false,rows,cols);
			if (liveCellNeighbours == 3) {
				// Dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.
				tempLiveCells[rows+'_'+cols] = 1;
				drawGameCell(rows,cols);
			}
		}

		if (JSON.stringify(liveCells) === JSON.stringify(tempLiveCells)){
			doTick = false;
			gameEnd();
		}
		liveCells = tempLiveCells;


		// Calculate average execution time and total generation
		var end = new Date().getTime();
		var executionTime = parseFloat(((end-start) / 1000 ).toFixed(3));
		tickExecutionTotal += executionTime;
		var tickAvg = (tickExecutionTotal / tickCount).toFixed(3);
		$("#tickAvg").text(tickAvg);
		$("#generations").text(tickCount);

	if (doTick){
		setTimeout(tick,0);
	}

}

function drawGameCell(row,col) {
	var x = (col * cellSize);
	var y = (row * cellSize);
	gameContext.fillStyle = '#000000';
	gameContext.fillRect(x,y,cellSize,cellSize);
}

function clearGameCell(row,col) {
	var x = (col * cellSize);
	var y = (row * cellSize);
	gameContext.clearRect(x-1,y-1,cellSize+2,cellSize+2);
}


function getCellNeighboursCount(isLive,row,col) {
	var cells = 0;

	row = Number(row);
	col = Number(col);

	// upper 3
	// +---+---+---+
	// | X | X | X |
	// | 0 | ■ | 0 |
	// | 0 | 0 | 0 |
	// +---+---+---+
	cells += isLivingCell(isLive,row - 1, col - 1)? 1 : 0;
	cells += isLivingCell(isLive,row - 1, col)? 1 : 0;
	cells += isLivingCell(isLive,row - 1, col + 1)? 1 : 0;

	// sides
	// +---+---+---+
	// | 0 | 0 | 0 |
	// | X | ■ | X |
	// | 0 | 0 | 0 |
	// +---+---+---+
	cells += isLivingCell(isLive,row, col - 1)? 1 : 0;
	cells += isLivingCell(isLive,row, col + 1)? 1 : 0;

	// lower 3
	// +---+---+---+
	// | 0 | 0 | 0 |
	// | 0 | ■ | 0 |
	// | X | X | X |
	// +---+---+---+
	cells += isLivingCell(isLive,row + 1, col - 1)? 1 : 0;
	cells += isLivingCell(isLive,row + 1, col)? 1 : 0;
	cells += isLivingCell(isLive,row + 1, col + 1)? 1 : 0;
	return cells;
}

function isLivingCell(isLive,row,col){
	if (row >= 0 && col >= 0 && row < gridHeight && col < gridWidth){
		if (liveCells[row+'_'+col] !== undefined) {
			return true;
		}else{
			if (isLive){
				deadCells[row+'_'+col] = 1;
			}
		}
	}
	return false;
}

function clearGrid() {
	liveCells = [];
	tickExecutionTotal = tickCount = 0;
	gameContext.clearRect(0, 0, (gridWidth*cellSize)+1, (gridHeight*cellSize)+1);
	initGrid(gridSeed);
}

function getLiveCells(){
	var cells = [];
	for (cell in liveCells){
		cells.push(cell.split('_'));
	}
	console.log(JSON.stringify(cells));
}
