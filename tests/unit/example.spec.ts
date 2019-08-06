import { shallowMount } from "@vue/test-utils";
import HelloWorld from "@/components/HelloWorld.vue";

describe("HelloWorld.vue", () => {
  it("renders props.msg when passed", () => {
    const msg = "Hello World";
    const wrapper = shallowMount(HelloWorld, {
      propsData: { msg }
    });
    
    expect(wrapper.text()).toMatch("Message: " + msg);
  });
});
