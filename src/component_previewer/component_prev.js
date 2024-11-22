class Component_Preview {
  constructor(component_name) {
    this.component_name = component_name;

    this.component_parts = {
      use_client_dir: "",
      css_file: "",
      declaration: `function ${this.component_name} (CHILDREN_PROPS)`,
      closure: "{ ... }",
    };

    this.component_array = [
      this.component_parts.declaration,
      this.component_parts.closure,
    ];
  }

  preview() {
    return this.component_array.join("\n");
  }

  add_children_props(add) {
    if (add)
      this.component_parts.declaration =
        this.component_parts.declaration.replace(
          "CHILDREN_PROPS",
          "{ children }"
        );
    else
      this.component_parts.declaration =
        this.component_parts.declaration.replace("CHILDREN_PROPS", "{ }");
  }

  dub() {
    return new Component_Preview(this.component_name);
  }
}

let component = new Component_Preview("WideButton");
let component2 = component.dub();

console.log(component.preview());
console.log(component2.preview());
