import React from "react";
import Table from "react-bootstrap/Table";

interface DisplayObjectPropertiesProps {
  data: Record<string, any>;
  title?: string;
}

const DisplayObj: React.FC<DisplayObjectPropertiesProps> = ({
  data,
  title,
}) => {
  const renderObject = (obj: Record<string, any>) => {
    return (
      <Table borderless responsive="lg" size="sm">
        <tbody>
          {Object.entries(obj).map(([key, value]) => (
            <tr key={key}>
              <td>
                <strong>{key}:</strong>
              </td>
              <td>
                {typeof value === "object" && value !== null ? (
                  // If the value is an object, recursively render its properties
                  <DisplayObj data={value} />
                ) : (
                  value // Otherwise, just display the value
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    );
  };

  return (
    <div>
      {title && <h5>{title}</h5>}
      {renderObject(data)} {/* Call the renderObject function to render data */}
    </div>
  );
};

export default DisplayObj;
