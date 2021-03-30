exports.format = (resp, data, err) => {
  if (err) {
    let errMessage = '';
    if (err.status === 400 && typeof err.message === 	'object') {
      Object.keys(err.message).map((key) => {
        err.message[key].map((msg) => {
          errMessage += `${msg}, `;
        });
      });
      errMessage = errMessage.substring(0, errMessage.length - 2);
    } else {
      errMessage = err.message;
    }

    resp.status(err.status || 500);
    resp.json({
      success: false,
      data: null,
      err: {
        code: err.code,
        message: errMessage,
      },
    });
  } else {
    resp.json({
      success: true,
      data,
      err: null,
    });
  }
};
