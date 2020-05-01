import React from 'react'
import * as joint from 'jointjs'
import * as dagre from 'dagre'
import $ from 'jquery'


let paper = null;
let graph = null;

function draw() {

    console.log(paper, graph);

    var rect = new joint.shapes.standard.Rectangle();
    rect.position(100, 30);
    rect.resize(100, 40);
    rect.attr({
        body: {
            fill: 'blue'
        },
        label: {
            text: 'Hello',
            fill: 'white'
        }
    });
    rect.addTo(graph);

    var rect2 = new joint.shapes.standard.Rectangle();
    rect2.position(400, 30);
    rect2.resize(100, 40);
    rect2.attr({
        body: {
            fill: '#2C3E50',
            rx: 5,
            ry: 5,
            strokeWidth: 2
        },
        label: {
            text: 'World!',
            fill: '#3498DB',
            fontSize: 18,
            fontWeight: 'bold',
            fontVariant: 'small-caps'
        }
    });
    rect2.addTo(graph);

    var link = new joint.shapes.standard.Link();
    link.source(rect);
    link.target(rect2);
    link.addTo(graph);

    var rect3 = new joint.shapes.standard.Rectangle();
    rect3.position(100, 130);
    rect3.resize(100, 40);
    rect3.attr({
        body: {
            fill: '#E74C3C',
            rx: 20,
            ry: 20,
            strokeWidth: 0
        },
        label: {
            text: 'Hello',
            fill: '#ECF0F1',
            fontSize: 11,
            fontVariant: 'small-caps'
        }
    });
    rect3.addTo(graph);

    var rect4 = new joint.shapes.standard.Rectangle();
    rect4.position(400, 130);
    rect4.resize(100, 40);
    rect4.attr({
        body: {
            fill: '#8E44AD',
            strokeWidth: 0
        },
        label: {
            text: 'World!',
            fill: 'white',
            fontSize: 13
        }
    });
    rect4.addTo(graph);

    var link2 = new joint.shapes.standard.Link();
    link2.source(rect3);
    link2.target(rect4);
    link2.addTo(graph);

    var rect5 = new joint.shapes.standard.Rectangle();
    rect5.position(100, 230);
    rect5.resize(100, 40);
    rect5.attr({
        body: {
            fill: '#2ECC71',
            strokeDasharray: '10,2'
        },
        label: {
            text: 'Hello',
            fill: 'black',
            fontSize: 13
        }
    });
    rect5.addTo(graph);

    var rect6 = new joint.shapes.standard.Rectangle();
    rect6.position(400, 230);
    rect6.resize(100, 40);
    rect6.attr({
        body: {
            fill: '#F39C12',
            rx: 20,
            ry: 20,
            strokeDasharray: '1,1'
        },
        label: {
            text: 'World!',
            fill: 'gray',
            fontSize: 18,
            fontWeight: 'bold',
            fontVariant: 'small-caps',
            textShadow: '1px 1px 1px black'
        }
    });
    rect6.addTo(graph);

    var link3 = new joint.shapes.standard.Link();
    link3.source(rect5);
    link3.target(rect6);
    link3.addTo(graph);
}

var Shape = joint.dia.Element.define('demo.Shape', {
    z: 2,
    size: {
        width: 100,
        height: 50
    },
    attrs: {
        body: {
            refWidth: '100%',
            refHeight: '100%',
            fill: 'ivory',
            stroke: 'gray',
            strokeWidth: 2,
            rx: 10,
            ry: 10
        },
        label: {
            refX: '50%',
            refY: '50%',
            yAlignment: 'middle',
            xAlignment: 'middle',
            fontSize: 30
        }
    }
}, {
    markup: [{
        tagName: 'rect',
        selector: 'body'
    }, {
        tagName: 'text',
        selector: 'label'
    }],

    setText: function (text) {
        return this.attr('label/text', text || '');
    }
});

var Link = joint.dia.Link.define('demo.Link', {
    attrs: {
        line: {
            connection: true,
            stroke: 'gray',
            strokeWidth: 2,
            pointerEvents: 'none',
            targetMarker: {
                type: 'path',
                fill: 'gray',
                stroke: 'none',
                d: 'M 10 -10 0 0 10 10 z'
            }
        }
    },
    connector: {
        name: 'rounded'
    },
    z: 1,
    weight: 1,
    minLen: 1,
    labelPosition: 'c',
    labelOffset: 10,
    labelSize: {
        width: 50,
        height: 30
    },
    labels: [{
        markup: [{
            tagName: 'rect',
            selector: 'labelBody'
        }, {
            tagName: 'text',
            selector: 'labelText'
        }],
        attrs: {
            labelText: {
                fill: 'gray',
                textAnchor: 'middle',
                refY: 5,
                refY2: '-50%',
                fontSize: 20,
                cursor: 'pointer'
            },
            labelBody: {
                fill: 'lightgray',
                stroke: 'gray',
                strokeWidth: 2,
                refWidth: '100%',
                refHeight: '100%',
                refX: '-50%',
                refY: '-50%',
                rx: 5,
                ry: 5
            }
        },
        size: {
            width: 50, height: 30
        }
    }]

}, {

    markup: [{
        tagName: 'path',
        selector: 'line',
        attributes: {
            'fill': 'none'
        }
    }],

    connect: function (sourceId, targetId) {
        return this.set({
            source: { id: sourceId },
            target: { id: targetId }
        });
    },

    setLabelText: function (text) {
        return this.prop('labels/0/attrs/labelText/text', text || '');
    }
});



function buildGraphFromAdjacencyList(adjacencyList) {

    var elements = [];
    var links = [];

    Object.keys(adjacencyList).forEach(function (parentLabel) {
        // Add element
        elements.push(
            new Shape({ id: parentLabel }).setText(parentLabel)
        );
        // Add links
        adjacencyList[parentLabel].forEach(function (childLabel) {
            links.push(
                new Link()
                    .connect(parentLabel, childLabel)
                    .setLabelText(parentLabel + '-' + childLabel)
            );
        });
    });

    // Links must be added after all the elements. This is because when the links
    // are added to the graph, link source/target
    // elements must be in the graph already.
    return elements.concat(links);
}

function draw2() {
    let _data = {
        a: ['b', 'c', 'd'],
        b: ['d', 'e'],
        c: [],
        d: [],
        e: ['e'],
        f: [],
        g: ['b', 'i'],
        h: ['f'],
        i: ['f', 'h']
    };
    let cells = buildGraphFromAdjacencyList(_data);

    paper.freeze();

    joint.layout.DirectedGraph.layout(cells, {
        dagre: dagre,
        graphlib: dagre.graphlib,
        setVertices: true,
        setLabels: true,
        ranker: 'network-simplex',
        rankDir: 'TB',
        align: 'UL',
        rankSep: 10,
        edgeSep: 10,
        nodeSep: 10
    });

    if (graph.getCells().length === 0) {
        // The graph could be empty at the beginning to avoid cells rendering
        // and their subsequent update when elements are translated
        graph.resetCells(cells);
    }

    paper.fitToContent({
        //padding: this.options.padding,
        allowNewOrigin: 'any',
        useModelGeometry: true
    });

    paper.unfreeze();
}

class LayoutGraph extends React.Component {

    constructor(props) {
        super(props);

        this.paper = null;
        this.graph = null;
    }

    componentDidMount() {
        graph = new joint.dia.Graph;

        paper = new joint.dia.Paper({
            el: document.getElementById('papermain'),
            model: graph,
            width: 600,
            height: 600, // height had to be increased
            gridSize: 10,
            drawGrid: true,
            background: {
                color: 'rgba(0, 255, 0, 0.3)'
            }
        });

        draw2();
    }

    render() {
        return (
            <div id='papermain' ></div>
        );
    }
}


export default LayoutGraph;


