"use client";

import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

interface Node {
  id: string;
  name: string;
  group: number;
  relevance: number;
}

interface Link {
  source: string;
  target: string;
  value: number;
}

interface GraphData {
  nodes: Node[];
  links: Link[];
}

export default function MeetingOverview({ meetingId }: { meetingId: string }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [data, setData] = useState<GraphData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // In a real implementation, this would fetch from an API
        // For now, we'll use mock data that resembles what would come from the transcription analysis
        const response = await fetch(`/api/meetings/${meetingId}/topics`);
        
        if (!response.ok) {
          throw new Error("Failed to fetch meeting topics");
        }
        
        const data = await response.json();
        setData(data);
      } catch (err) {
        console.error("Error fetching topic data:", err);
        setError("Failed to load topic relationships");
        
        // For demo purposes, use mock data if API fails
        setData(getMockGraphData());
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [meetingId]);

  useEffect(() => {
    if (!data || !svgRef.current) return;

    // Clear previous visualization
    d3.select(svgRef.current).selectAll("*").remove();

    const width = svgRef.current.clientWidth;
    const height = 500;

    const svg = d3.select(svgRef.current)
      .attr("viewBox", `0 0 ${width} ${height}`)
      .attr("width", width)
      .attr("height", height);

    // Create a force simulation
    const simulation = d3.forceSimulation<Node & d3.SimulationNodeDatum>()
      .force("link", d3.forceLink<Node, Link & d3.SimulationLinkDatum<Node>>().id(d => d.id).distance(100))
      .force("charge", d3.forceManyBody().strength(-400))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide().radius(d => 40 * Math.sqrt(d.relevance)));

    // Create links
    const link = svg.append("g")
      .attr("stroke", "#999")
      .attr("stroke-opacity", 0.6)
      .selectAll("line")
      .data(data.links)
      .join("line")
      .attr("stroke-width", d => Math.sqrt(d.value) * 2);

    // Create node groups
    const node = svg.append("g")
      .selectAll("g")
      .data(data.nodes)
      .join("g")
      .call(drag(simulation));

    // Add circles to nodes
    node.append("circle")
      .attr("r", d => 30 * Math.sqrt(d.relevance))
      .attr("fill", d => d3.schemeCategory10[d.group % 10]);

    // Add text labels to nodes
    node.append("text")
      .attr("text-anchor", "middle")
      .attr("dy", "0.3em")
      .attr("font-size", d => 12 * Math.sqrt(d.relevance) + "px")
      .text(d => d.name)
      .attr("fill", "white");

    // Update positions on each tick
    simulation.nodes(data.nodes).on("tick", () => {
      link
        .attr("x1", d => (d.source as unknown as Node).x || 0)
        .attr("y1", d => (d.source as unknown as Node).y || 0)
        .attr("x2", d => (d.target as unknown as Node).x || 0)
        .attr("y2", d => (d.target as unknown as Node).y || 0);

      node.attr("transform", d => `translate(${d.x},${d.y})`);
    });

    // Add links to simulation
    simulation.force<d3.ForceLink<Node, Link>>("link")!
      .links(data.links);

    // Drag behavior function
    function drag(simulation: d3.Simulation<Node, undefined>) {
      function dragstarted(event: any, d: Node & d3.SimulationNodeDatum) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
      }
      
      function dragged(event: any, d: Node & d3.SimulationNodeDatum) {
        d.fx = event.x;
        d.fy = event.y;
      }
      
      function dragended(event: any, d: Node & d3.SimulationNodeDatum) {
        if (!event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
      }
      
      return d3.drag<SVGGElement, Node>()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended);
    }

    return () => {
      simulation.stop();
    };
  }, [data]);

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading relationship map...</div>;
  }

  if (error && !data) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500 mb-2">{error}</p>
        <button 
          className="px-4 py-2 bg-blue-500 text-white rounded-md"
          onClick={() => setData(getMockGraphData())}
        >
          Load sample data
        </button>
      </div>
    );
  }

  return (
    <div className="relative">
      <h2 className="text-xl font-semibold mb-4">Topic Relationship Map</h2>
      <div className="border rounded-lg overflow-hidden bg-gray-50">
        <svg ref={svgRef} className="w-full"></svg>
      </div>
      <div className="mt-4 text-sm text-gray-500">
        <p>Nodes represent key topics from the meeting. Size indicates relevance, and connections show relationships between topics.</p>
        <p>Drag nodes to explore relationships. Zoom or pan to navigate the graph.</p>
      </div>
    </div>
  );
}

// Mock data for demonstration
function getMockGraphData(): GraphData {
  return {
    nodes: [
      { id: "1", name: "CRM Platform", group: 1, relevance: 1 },
      { id: "2", name: "Customer Relations", group: 1, relevance: 0.8 },
      { id: "3", name: "Automation", group: 2, relevance: 0.7 },
      { id: "4", name: "Lead Management", group: 3, relevance: 0.6 },
      { id: "5", name: "Revenue Growth", group: 4, relevance: 0.5 },
      { id: "6", name: "Product Features", group: 2, relevance: 0.4 },
      { id: "7", name: "Market Position", group: 3, relevance: 0.3 },
      { id: "8", name: "Onboarding", group: 4, relevance: 0.3 },
      { id: "9", name: "Pricing", group: 5, relevance: 0.2 },
    ],
    links: [
      { source: "1", target: "2", value: 5 },
      { source: "1", target: "3", value: 4 },
      { source: "1", target: "4", value: 3 },
      { source: "2", target: "5", value: 2 },
      { source: "3", target: "6", value: 2 },
      { source: "4", target: "5", value: 1 },
      { source: "1", target: "7", value: 1 },
      { source: "2", target: "8", value: 1 },
      { source: "3", target: "9", value: 1 },
      { source: "5", target: "7", value: 1 },
    ]
  };
} 