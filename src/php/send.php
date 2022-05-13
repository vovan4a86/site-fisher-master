<?php

const SITE_NAME = 'bounty-hunter.uz';
const FROM_NAME = 'Bounty Hunter';
const EMAIL = 'shop@mdregion.uz';
// const EMAIL = 'lyutikov@mdregion.ru';

function test_input($data): string {
    $data = trim($data);
    $data = stripcslashes($data);
    return htmlspecialchars($data);
}
$response = [
    'accept' => false,
    'error' => ''
];

if($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name = test_input($_POST['name']);
    $city = test_input($_POST['city']);
    $email = test_input($_POST['email']);
    $phone = test_input($_POST['phone']);
    $comment = test_input($_POST['comment']);

    if (mb_strlen($comment) == 0) {
        $comment = "---";
    }

    if ($name === '' || $city === '') {
        $response['error'] = 'Ошибка на сервере. Необходимо заполнить все поля.';
    } else if (!preg_match("/^(\+)?[0-9-]+/", $phone)) {
        $response['error'] = 'Ошибка на сервере. Проверьте введенный телефон.';
    } else if (!preg_match("/^([a-z0-9_-]+\.)*[a-z0-9_-]+@[a-z0-9_-]+(\.[a-z0-9_-]+)*\.[a-z]{2,6}$/", $email)) {
        $response['error'] = 'Ошибка на сервере. Проверьте введенный email.';
    } else {
        $response['accept'] = true;
        $message = '
             <html lang="ru">
             <head>
               <title>Новая заявка</title>
             </head>
             <style>
               th, td { padding: 10px };
             </style>
             <body>
               <p>Новая заявка с сайта '. SITE_NAME .'</p>
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
    }

    if($response['accept']) {
        $to      = EMAIL;
        $subject = "Новая заявка с сайта ". SITE_NAME;
        $headers = "MIME-Version: 1.0" . PHP_EOL .
            "Content-Type: text/html; charset=utf-8" . PHP_EOL .
            "From: Заявка " . FROM_NAME . " <" . SITE_NAME . ">" . PHP_EOL .
            "To: Manager ". "<" . EMAIL . ">" . PHP_EOL;

        $filename = './form_log.txt';
        $input_data = $name .', '. $city . ', ' . $email . ', ' . $phone . ', ' . $comment;
        $date = new DateTime();
        $now = $date->format('Y-m-d H:i');


        if (mail($to, $subject, $message, $headers)) {
            http_response_code(200);
            $response['accept'] = true;
            file_put_contents($filename, $now . ' | ' . $input_data . " --> Данные успешно отправлены." . PHP_EOL, FILE_APPEND | LOCK_EX);
        } else {
            http_response_code(400);
            $response['error'] = 'Ошибка на сервере. Данные не отправлены на почту';
            file_put_contents($filename, $now . ' | ' . $input_data . " --> Ошибка. Данные не отправлены." . PHP_EOL, FILE_APPEND | LOCK_EX);
        }
    }

    echo json_encode($response);
}
