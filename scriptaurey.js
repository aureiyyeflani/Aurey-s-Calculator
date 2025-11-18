// Wrapper untuk memastikan kode JavaScript dieksekusi setelah seluruh elemen HTML dimuat di browser
document.addEventListener('DOMContentLoaded', function() {
    
    // Mendapatkan referensi ke elemen HTML yang digunakan (layar kalkulator, gambar status, dan semua tombol)
    const display = document.getElementById('display');
    const statusImage = document.getElementById('statusImage');
    const buttons = document.querySelectorAll('.btn-calc');

    // Definisi URL gambar placeholder untuk berbagai status kalkulator
    // Diubah: imgNormal sekarang menggunakan placeholder Aurey Efaleani agar tidak berubah menjadi 'Kalkulator'
    const imgNormal = 'https://placehold.co/400x100/A1887F/E6D7C8?text=Aurey+Efaleani+_+1710624121'; 
    const imgSuccess = 'https://placehold.co/400x100/556B2F/FFFFFF?text=Sukses!'; // Menggunakan warna hijau/olive vintage
    const imgError = 'https://placehold.co/400x100/D32F2F/FFFFFF?text=Error!'; // Menggunakan warna merah tua vintage

    /**
      Fungsi ini digunakan untuk mengubah gambar status (statusImage) berdasarkan hasil perhitungan (success, error, atau kembali ke normal).
     */
    function changeImage(state) {
        if (state === 'success') {
            statusImage.src = imgSuccess;
            statusImage.alt = "Perhitungan Sukses";
        } else if (state === 'error') {
            statusImage.src = imgError;
            statusImage.alt = "Error Perhitungan";
        } else {
            // Mengatur kembali gambar status ke tampilan default Aurey Efaleani
            statusImage.src = imgNormal;
            statusImage.alt = "Status Kalkulator";
        }
    }

    /**
      Fungsi ini digunakan untuk mereset layar input kalkulator menjadi kosong dan mengembalikan gambar status ke Normal.
     */
    function clearDisplay() {
        display.value = '';
        changeImage('normal'); // Memanggil function untuk merubah gambar kembali ke default Aurey Efaleani
    }

    /**
      Fungsi ini digunakan untuk menghapus satu karakter terakhir pada input kalkulator (fungsi DEL/Backspace).
     */
    function deleteLastChar() {
        display.value = display.value.slice(0, -1);
    }

    /**
      Fungsi ini digunakan untuk menambahkan nilai tombol yang ditekan ke tampilan layar kalkulator.
     */
    function appendToDisplay(value) {
        display.value += value;
    }

    /**
      Fungsi utama yang memicu perhitungan matematika dan menangani hasil (Success/Error).
     */
    function calculateResult() {
        // Pengecekan apakah layar kosong sebelum kalkulasi
        if (display.value === '') {
            changeImage('error');
            display.value = 'Kosong!';
            // Memberi jeda waktu 1.5 detik sebelum layar di-clear otomatis setelah muncul pesan error/kosong
            setTimeout(clearDisplay, 1500);
            return;
        }

        try {
            // Menggunakan fungsi eval() untuk mengevaluasi string matematika. Ini harus dihindari di produksi, tapi umum di kalkulator sederhana.
            let result = eval(display.value
                .replace(/%/g, '/100') // Mengganti simbol '%' menjadi '/100' agar fungsi eval dapat menghitung persentase.
            );
            
            // Pengecekan hasil: Memastikan hasil perhitungan adalah angka yang valid (bukan Infinity atau NaN)
            if (isFinite(result)) {
                display.value = result;
                changeImage('success'); // Mengubah gambar status menjadi 'Sukses!' setelah perhitungan berhasil.
            } else {
                throw new Error("Hasil tidak valid");
            }

        } catch (error) {
            console.error("Error kalkulasi:", error);
            display.value = 'Error';
            changeImage('error'); // Mengubah gambar status menjadi 'Error!' saat terjadi kesalahan perhitungan.
            setTimeout(clearDisplay, 1500);
        }
    }


    // Menambahkan Event Listener untuk semua tombol kalkulator
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            const value = button.getAttribute('data-value');

            // Struktur kontrol untuk menjalankan fungsi yang sesuai berdasarkan nilai tombol
            switch(value) {
                case 'C':
                    // Memanggil fungsi Clear Display untuk mereset input dan status gambar.
                    clearDisplay();
                    break;
                case 'DEL':
                    // Memanggil fungsi Delete Last Character.
                    deleteLastChar();
                    break;
                case '=':
                    // Memanggil fungsi Calculate Result untuk menghitung hasil.
                    calculateResult();
                    break;
                default:
                    // Logika jika tombol yang ditekan adalah angka atau operator.
                    if (statusImage.src === imgSuccess || statusImage.src === imgError) {
                        clearDisplay(); // Menghapus layar jika user mulai mengetik setelah hasil sukses/error.
                    }
                    appendToDisplay(value);
                    break;
            }
        });
    });

    // Menambahkan Event Listener untuk input dari keyboard
    document.addEventListener('keydown', (e) => {
        const key = e.key;

        if (key >= '0' && key <= '9' || key === '.' || key === '+' || key === '-' || key === '*' || key === '/' || key === '%') {
            if (statusImage.src === imgSuccess || statusImage.src === imgError) {
                clearDisplay();
            }
            appendToDisplay(key);
            e.preventDefault();
        } else if (key === 'Enter' || key === '=') {
            calculateResult();
            e.preventDefault();
        } else if (key === 'Backspace') {
            deleteLastChar();
            e.preventDefault();
        } else if (key === 'Escape' || key.toLowerCase() === 'c') {
            clearDisplay();
            e.preventDefault();
        }
    });

});