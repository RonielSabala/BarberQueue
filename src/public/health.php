<?php

use Domain\HeaderType\HeaderType;

header(HeaderType::PlainText->header());
http_response_code(200);
echo "Hello World";
