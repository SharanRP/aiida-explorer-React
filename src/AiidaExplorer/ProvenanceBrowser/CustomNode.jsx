import React, { memo, useEffect, useState, useRef } from 'react';
import { Handle, Position } from 'reactflow';
import Tooltip from './Tooltip';

const apiCache = {};

const getNodeStyle = (label, isPreviouslySelected) => {
  if (!label) {
    return {
      background: '#FFCC80',
      borderRadius: '4px',
      width: '150px',
      height: '60px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      border: isPreviouslySelected ? '2px solid blue' : '1px solid #000',
      transition: 'all 0.3s ease-in-out',
      overflow: 'hidden',
    };
  }

  switch (label.toLowerCase()) {
    case 'calcjobnode':
      return {
        background: '#F5B1CD',
        borderRadius: '4px',
        width: '170px',
        height: '80px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        border: isPreviouslySelected ? '2px solid blue' : '1px solid #000',
        transition: 'all 0.3s ease-in-out',
        overflow: 'hidden',
      };
    case 'workchainnode':
      return {
        background: '#f5b7b1',
        borderRadius: '4px',
        width: '170px',
        height: '80px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        border: isPreviouslySelected ? '2px solid blue' : '1px solid #000',
        transition: 'all 0.3s ease-in-out',
        overflow: 'hidden',
      };
    default:
      return {
        background: '#82e0aa',
        borderRadius: '4px',
        width: '150px',
        height: '60px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        border: isPreviouslySelected ? '2px solid blue' : '1px solid #000',
        transition: 'all 0.3s ease-in-out',
        overflow: 'hidden',
      };
  }
};

const CustomNode = ({ data }) => {
  const [subtitle, setSubtitle] = useState('');
  const [labelRe, setLabelRe] = useState(data.label);
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const nodeRef = useRef(null);

  const extractLabel = (nodeType) => {
    if (!nodeType) return '';
    const parts = nodeType.split('.');
    return parts[parts.length - 2];
  };

  useEffect(() => {
    const fetchNodeData = async () => {
      try {
        if (!apiCache[data.uuid]) {
          const [response, response2, response3] = await Promise.all([
            fetch(`https://aiida.materialscloud.org/mc3d/api/v4/nodes/${data.uuid}`),
            fetch(`https://aiida.materialscloud.org/mc3d/api/v4/nodes/${data.uuid}/contents/attributes`),
            fetch(`https://aiida.materialscloud.org/mc3d/api/v4/nodes/${data.uuid}/contents/derived_properties`)
          ]);

          let subtitle = '';

          if (response3.ok) {
            const result3 = await response3.json();
            const formula = result3.data?.derived_properties?.formula;
            if (formula) {
              subtitle = formula;
            }
          }

          if (!subtitle && response2.ok) {
            const result2 = await response2.json();
            const value = result2.data?.attributes?.value;
            if (value !== null && value !== undefined) {
              subtitle = String(value);
            }
          }

          if (response.ok) {
            const result = await response.json();
            const nodeType = extractLabel(result.data.nodes[0].node_type);
            setLabelRe(nodeType); // Update labelRe state here
            const nodeDetails = result.data?.nodes?.[0]?.process_type;
            if (nodeDetails) {
              const parts = nodeDetails.split(':');
              subtitle = parts.length > 1 ? parts[1] : nodeDetails;
            }
          }

          const fetchedNodeData = { subtitle, label: data.label };
          apiCache[data.uuid] = fetchedNodeData;
          setSubtitle(subtitle);
        } else {
          const cachedData = apiCache[data.uuid];
          setLabelRe(cachedData.label);
          setSubtitle(cachedData.subtitle);
        }
      } catch (error) {
        console.error('Error fetching node data:', error);
        setSubtitle('');
      }
    };

    fetchNodeData();
  }, [data.uuid, data.label]);

  // const handleMouseEnter = (event) => {
  //   setTooltipPosition({ x: event.clientX, y: event.clientY });
  //   setShowTooltip(true);
  // };

  // const handleMouseLeave = () => {
  //   setShowTooltip(false);
  // };

  console.log('labelRe:', labelRe);

  return (
    <div
      ref={nodeRef}
      style={getNodeStyle(data.label)} 
      // onMouseEnter={handleMouseEnter}
      // onMouseLeave={handleMouseLeave}
    >
      <Handle
        type="target"
        position={Position.Left}
        style={{ background: '#555' }}
        onConnect={(params) => console.log('handle onConnect', params)}
      />
      <div className="flex-col">
        <div className="text-sm text-center whitespace-nowrap overflow-hidden overflow-ellipsis">
          {labelRe}
        </div>
        {subtitle && (
          <div className="text-xs font-thin text-center whitespace-nowrap overflow-hidden overflow-ellipsis mt-1">
            <i>{subtitle}</i>
          </div>
        )}
      </div>
      <Handle
        type="source"
        position={Position.Right}
        style={{ background: '#555' }}
        onConnect={(params) => console.log('handle onConnect', params)}
      />
    </div>
  );
};

export default memo(CustomNode);
