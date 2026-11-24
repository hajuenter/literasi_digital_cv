    const scriptURL =
        'https://script.google.com/macros/s/AKfycbzyx0iiteD0JVguM-v_-ru2oqYRUjKlH3X-X0kjY-uIbhkIopHxNE_X_f7MZ-0VNrgx/exec'
    const form = document.forms['submit-to-google-sheet']
    const successAlert = document.getElementById('success-alert')
    const submitButton = document.getElementById('submit-btn')

    form.addEventListener('submit', e => {
        e.preventDefault()

        // Nonaktifkan tombol saat mengirim untuk mencegah pengiriman ganda
        submitButton.disabled = true
        submitButton.innerText = 'Mengirim...'

        fetch(scriptURL, { method: 'POST', body: new FormData(form) })
            .then(response => {
                console.log('Success!', response)

                // Tampilkan alert sukses
                successAlert.classList.remove('hidden')

                // Reset formulir
                form.reset()

                // Aktifkan kembali tombol submit
                submitButton.disabled = false
                submitButton.innerText = 'Send Message'

                // Sembunyikan alert setelah 5 detik
                setTimeout(() => {
                    successAlert.classList.add('hidden')
                }, 5000)
            })
            .catch(error => {
                console.error('Error!', error.message)

                // Jika terjadi error, aktifkan kembali tombol submit
                submitButton.disabled = false
                submitButton.innerText = 'Send Message'

                // Opsional: Tambahkan alert error
                alert('Terjadi kesalahan saat mengirim pesan. Silakan coba lagi.')
            })
    })
