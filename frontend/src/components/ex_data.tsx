import React from "react";
import { Table } from "react-bootstrap";

interface Memory {
  date: string;
  location: string;
  entities: string;
  text: string;
}

const memories: Memory[] = [
  {
    date: "",
    location: "",
    entities: "John, Alice, Meeting",
    text: "Had a brainstorming session with John and Alice about the new project.",
  },
  {
    date: "2024-12-09",
    location: "",
    entities: "Conference, Networking, Tech World",
    text: "Attended the Tech World 2024 conference and met some amazing people.",
  },
  {
    date: "2024-12-07",
    location: "Seattle, WA",
    entities: "Rain, Coffee",
    text: "Spent the day exploring coffee shops and enjoying the rainy weather in Seattle.",
  },
  {
    date: "",
    location: "Boston, MA",
    entities: "Marathon, Running",
    text: "Ran the Boston Marathon, an incredible experience!",
  },
  {
    date: "2024-12-03",
    location: "Austin, TX",
    entities: "BBQ, Music",
    text: "Enjoyed some amazing BBQ and live music in Austin.",
  },
];

const ExData: React.FC = () => {
  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>Date</th>
          <th>Location</th>
          <th>Entities</th>
          <th>Text</th>
        </tr>
      </thead>
      <tbody>
        {memories.map((memory, index) => (
          <tr key={index}>
            <td>{memory.date}</td>
            <td>{memory.location}</td>
            <td>{memory.entities}</td>
            <td>{memory.text}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default ExData;
