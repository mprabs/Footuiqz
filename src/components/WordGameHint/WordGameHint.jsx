import { Typography, Flex, Card, Alert, Collapse, Modal, Button, Divider } from "antd";
import { TeamOutlined, GlobalOutlined, ScheduleOutlined, TrophyOutlined, PlusOutlined, MinusCircleFilled, BulbOutlined } from "@ant-design/icons";

const { Text } = Typography;

import "./WordGameHint.css";
import { useState } from "react";

const WordGameHint = ({ player = {} }) => {
  const [isHintModalVisible, setIsHintModalVisible] = useState(true);

  const parseArray = (arrayString) => {
    try {
      const parsedArray = JSON.parse(arrayString.replace(/'/g, '"'));

      if (Array.isArray(parsedArray)) {
        return parsedArray;
      }

      return arrayString.split(",").map((item) => item.trim().replace(/'/g, ""));
    } catch (error) {
      return arrayString.split(",").map((item) => item.trim().replace(/'/g, ""));
    }
  };

  const clubsArray = parseArray(player.clubs);
  const seasonsArray = parseArray(player.seasons);

  return (
    <>
      <Divider>
        <Flex align="center" justify="center" style={{ margin: "40px 0" }}>
          <Button onClick={() => setIsHintModalVisible(true)} className="show-hint-button" icon={<BulbOutlined />} type="text">
            View Hint
          </Button>
        </Flex>
      </Divider>

      <Modal
        onCancel={() => setIsHintModalVisible(false)}
        className="word-game-hint"
        open={isHintModalVisible}
        footer={null}
        centered
        destroyOnClose
        title="Hint"
      >
        <Collapse
          expandIcon={({ isActive }) => (isActive ? <MinusCircleFilled /> : <PlusOutlined />)}
          size="large"
          style={{ maxWidth: "600px", margin: "2rem" }}
          defaultActiveKey={["1"]}
          items={[
            {
              key: "1",
              label: "Player Data",
              children: (
                <Flex vertical gap={10} style={{ maxWidth: "100%" }}>
                  <Text className="hint-data-item">
                    <TeamOutlined /> <Typography.Text strong>Position:</Typography.Text>
                    <span> {player.position}</span>
                  </Text>
                  <Text className="hint-data-item">
                    <GlobalOutlined /> <Typography.Text strong>Nationality:</Typography.Text>
                    <span> {player.nationality}</span>
                  </Text>
                  {Array.isArray(clubsArray) && (
                    <Text className="hint-data-item">
                      <TeamOutlined /> <Typography.Text strong>Clubs: </Typography.Text>
                      <span>
                        {clubsArray.map((club, index) => (
                          <span key={index}>{club}</span>
                        ))}
                      </span>
                    </Text>
                  )}

                  {Array.isArray(seasonsArray) && (
                    <Text className="hint-data-item">
                      <TeamOutlined /> <Typography.Text strong>Seasons: </Typography.Text>
                      <span>
                        {seasonsArray.map((season, index) => (
                          <span key={index}>{season}</span>
                        ))}
                      </span>
                    </Text>
                  )}

                  <Text className="hint-data-item">
                    <ScheduleOutlined /> <Typography.Text strong>Number of Seasons:</Typography.Text>
                    <span> {player.num_of_seasons}</span>
                  </Text>
                  <Text className="hint-data-item">
                    <TrophyOutlined /> <Typography.Text strong>Apps:</Typography.Text>
                    <span> {player.apps}</span>
                  </Text>
                  <Text className="hint-data-item">
                    <TrophyOutlined /> <Typography.Text strong>Wins:</Typography.Text>
                    <span> {player.wins}</span>
                  </Text>
                  <Text className="hint-data-item">
                    <TrophyOutlined /> <Typography.Text strong>Losses:</Typography.Text>
                    <span> {player.losses}</span>
                  </Text>
                  <Text className="hint-data-item">
                    <TrophyOutlined /> <Typography.Text strong>Clean Sheets:</Typography.Text>
                    <span> {player.clean_sheets}</span>
                  </Text>
                  <Text className="hint-data-item">
                    <TrophyOutlined /> <Typography.Text strong>Assists:</Typography.Text>
                    <span> {player.assists}</span>
                  </Text>
                  <Text className="hint-data-item">
                    <TrophyOutlined /> <Typography.Text strong>Goals:</Typography.Text>
                    <span> {player.goals}</span>
                  </Text>
                </Flex>
              ),
            },
          ]}
        />
        <Alert message="Your remaining attempts have been reduced by 1." type="success" style={{ margin: "2rem", textAlign: "center" }} />
      </Modal>
    </>
  );
};

export default WordGameHint;
