import { useEffect, useRef, useState } from "react";
import PRODUCTS from "@client/productsClient.js"
import { useParams } from "react-router-dom";
import { useAuth } from "../../contexts/Auth";
import { formatDate, fixUrl, timeAgo } from "../../helpers/helpers";
import "./style.css";
import { toast } from "react-toastify";

const index = () => {
	const { id } = useParams();
	const { currentUser } = useAuth();
	const [productChatMessages, setProductChatMessages] = useState([]);
	const [message, setMessage] = useState({
		message: "",
		message_type: "text",
	});

	/* -------------------------------------------------------------------------------------------- */
	/*                                       Fetch Product ChatMessages                                      */
	/* -------------------------------------------------------------------------------------------- */
	const fetchProductChatMessages = async () => {

		const { data, error } = await PRODUCTS.getChatMessages(id);
		if (data) {
			scrollToBottom()
			setProductChatMessages(data.ProductChatMessages);
		}
		if (error) {
			console.error(error.data.message);
		}

	};

	/* -------------------------------------------------------------------------------------------- */
	/*                                         Handle Change                                        */
	/* -------------------------------------------------------------------------------------------- */

	const handleChange = (e) => {
		setMessage((prev) => ({ ...prev, [e.target.name]: e.target.value }));
	};


	const messagesEndRef = useRef(null);

	const scrollToBottom = () => {
		if (messagesEndRef.current) {
			messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
		}
	};

	/* -------------------------------------------------------------------------------------------- */
	/*                                         Handle Submit                                        */
	/* -------------------------------------------------------------------------------------------- */

	const handleSubmit = async (e) => {
		e.preventDefault();
		const { data, error } = await PRODUCTS.insertMessage(id, message);
		if (data) {
			scrollToBottom();
			setProductChatMessages((currentMessages) => {
				return Array.isArray(currentMessages) ? [...currentMessages, data.newMessage] : [data.newMessage];
			});
			setMessage({ message: "", message_type: "text" });
		}
		if (error) {
			toast.error(error.data.message);
		}
	};

	useEffect(() => {
		fetchProductChatMessages()
		scrollToBottom()
	}, []);

	useEffect(() => {
		setInterval(() => {
			fetchProductChatMessages()
		}, 20_000)
	}, [])
	return (
		<div class="LiveChat">
			<div class="chat_box">
				<div class="head">
					<div class="user">
						<div class="avatar">
							<img src="https://picsum.photos/g/40/40" />
						</div>
						<div class="name">Kai Cheng</div>
					</div>
					<ul class="bar_tool">
						<li><span class="alink"><i class="fas fa-phone"></i></span></li>
						<li><span class="alink"><i class="fas fa-video"></i></span></li>
						<li><span class="alink"><i class="fas fa-ellipsis-v"></i></span></li>
					</ul>
				</div>
				<div class="body">
					{Array.isArray(productChatMessages) && productChatMessages.length > 0 ? (
						productChatMessages.map((faker, fakerKey) => (
							<div
								key={fakerKey}
								className={`${faker?.user_id === currentUser?.id ? "outgoing" : "incoming"}`}
							>
								<div className={`bubble ${faker?.user_id === currentUser?.id ? "lower" : ""}`}>
									<p>{faker.message}</p>
									<p>{timeAgo(faker.created_at)}</p>
								</div>
							</div>
						))
					) : (
						<p>No Messages!</p>
					)}
					{/* <div class="typing">
						<div class="bubble">
							<div class="ellipsis dot_1"></div>
							<div class="ellipsis dot_2"></div>
							<div class="ellipsis dot_3"></div>
						</div>
					</div> */}
				</div>
				<div class="foot">
					<input type="text" name={'message'} onChange={handleChange} value={message.message} class="msg" placeholder="Type a message..." />
					<button onClick={handleSubmit} type="submit">Submit <i class="fas fa-paper-plane"></i></button>
				</div>
			</div>
		</div>

	)
}

export default index