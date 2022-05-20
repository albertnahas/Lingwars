import React from "react";
import { shallow } from "enzyme";
import { Timer } from "./Timer";

describe("Timer widget", function () {
  it("renders without crashing", () => {
    const component = shallow(<Timer active={true} />);
    expect(component).toMatchSnapshot();
  });

  it("starts at 00:00", () => {
    const component = shallow(<Timer active={true} />);
    expect(component.find("span.timer").text()).toContain("00:00");
  });

  it("starting time works", () => {
    const component = shallow(<Timer startingTime={30} active={true} />);
    expect(component.find("span.timer").text()).toContain("00:30");
  });
});
