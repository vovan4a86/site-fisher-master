<?php

$name = $city = $email = $phone = $comment = "";

$name = test_input($_POST['name']);
$city = test_input($_POST['city']);
$email = test_input($_POST['email']);
$phone = test_input($_POST['phone']);
$comment = test_input($_POST['comment']);

function test_input($data) {
	$data = trim($data);
	$data = stripcslashes($data);
	$data = htmlspecialchars($data);
	return $data;
}

$message = '
<html>
<head>
  <title>Новая заявка</title>
</head>
<body>
  <p>Новая заявка с сайта bounty-hunter.com</p>
  <table>
    <tr>
      <th>Имя</th><th>Город</th><th>Email</th><th>Phone</th><th>Комментарий</th>
    </tr>
    <tr>
      <td>'.$name.'</td><td>'.$city.'</td><td>'.$email.'</td><td>'.$phone.'</td><td>'.$comment.'</td>
    </tr>
  </table>
</body>
</html>';

$to      = 'manager-bounty@yandex.ru';
$subject = 'Новая заявка с сайта';
$headers = "MIME-Version: 1.0" . PHP_EOL .
"Content-Type: text/html; charset=utf-8" . PHP_EOL .
'From: Script <script@bounty-site.ru>' . PHP_EOL .
'To: Manager <manager-bounty@yandex.ru>' . PHP_EOL;

if (mail($to, $subject, $message, $headers)) {
    http_response_code(200);
    echo "Данные успешно отправлены.";
} else {
    http_response_code(400);
    echo "Ошибка. Данные не отправлены.";
};