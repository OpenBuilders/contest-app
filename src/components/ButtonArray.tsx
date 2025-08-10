import "./ButtonArray.scss";
import { type Component, For } from "solid-js";
import { Dynamic } from "solid-js/web";

type ButtonArrayItem = {
	component: Component;
	fontSize?: string;
	class?: string;
	onClick?: (e: MouseEvent) => void;
};

type ButtonArrayProps = {
	items: ButtonArrayItem[];
};

const ButtonArray: Component<ButtonArrayProps> = (props) => {
	return (
		<ul class="button-array">
			<For each={props.items}>
				{(item) => (
					<li
						onClick={item.onClick}
						class={item.class}
						style={{ "font-size": item.fontSize ?? "1rem" }}
					>
						<Dynamic component={item.component} />
					</li>
				)}
			</For>
		</ul>
	);
};

export default ButtonArray;
