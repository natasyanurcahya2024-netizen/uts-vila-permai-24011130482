const dataVila = [
    {
        id: "v1",
        nama: "Vila AA",
        tipe: "3 Kamar Tidur + Kolam Renang Pribadi",
        lokasi: "Puncak Pass, Bogor",
        harga: 1250000,
        fasilitas: "AC, WiFi, Kolam Renang, TV, Water Heater, Dapur Lengkap",
        status: "Tersedia"
    },
    {
        id: "v2",
        nama: "Vila Teteh",
        tipe: "2 Kamar Tidur - View Pegunungan",
        lokasi: "Cisarua, Bogor",
        harga: 850000,
        fasilitas: "WiFi, TV, Water Heater, Balkon, Perlengkapan BBQ",
        status: "Tersedia"
    },
    {
        id: "v3",
        nama: "Vila Flamboyan",
        tipe: "4 Kamar Tidur - Kapasitas Keluarga Besar",
        lokasi: "Megamendung, Bogor",
        harga: 1750000,
        fasilitas: "AC, WiFi, Kolam Renang, Karaoke, Halaman Luas, Billiard",
        status: "Tersedia"
    }
];

const containerVila = document.getElementById('containerVila');
const pilihVila = document.getElementById('pilihVila');
const inputPencarian = document.getElementById('inputPencarian');
const formPemesanan = document.getElementById('formPemesanan');
const inputCheckIn = document.getElementById('checkIn');
const inputCheckOut = document.getElementById('checkOut');
const inputJumlahTamu = document.getElementById('jumlahTamu');
const infoDurasi = document.getElementById('infoDurasi');
const infoHargaSatuan = document.getElementById('infoHargaSatuan');
const infoTotalBiaya = document.getElementById('infoTotalBiaya');
const pesanError = document.getElementById('pesanError');
const pesanSukses = document.getElementById('pesanSukses');
const infoRiwayat = document.getElementById('infoRiwayat');

function renderVila(arrayVila) {
    containerVila.innerHTML = '';
    arrayVila.forEach(vila => {
        const article = document.createElement('article');
        article.className = 'villa-card';

        const divContent = document.createElement('div');
        
        const h3 = document.createElement('h3');
        h3.className = 'villa-card_title';
        h3.textContent = vila.nama;

        const pDetails = document.createElement('p');
        pDetails.className = 'villa-card_details';
        pDetails.innerHTML = `<strong>Tipe:</strong> ${vila.tipe}<br><strong>Lokasi:</strong> ${vila.lokasi}<br><strong>Fasilitas:</strong> ${vila.fasilitas}<br><strong>Status:</strong> ${vila.status}`;

        divContent.appendChild(h3);
        divContent.appendChild(pDetails);

        const pPrice = document.createElement('p');
        pPrice.className = 'villa-card_price';
        pPrice.textContent = `Rp ${vila.harga.toLocaleString('id-ID')} / malam`;

        article.appendChild(divContent);
        article.appendChild(pPrice);
        containerVila.appendChild(article);
    });
}

function populateDropdown() {
    dataVila.forEach(vila => {
        const option = document.createElement('option');
        option.value = vila.id;
        option.textContent = `${vila.nama} - Rp ${vila.harga.toLocaleString('id-ID')}/malam`;
        pilihVila.appendChild(option);
    });
}

function hitungTotalHarga() {
    try {
        const idVila = pilihVila.value;
        const tglIn = new Date(inputCheckIn.value);
        const tglOut = new Date(inputCheckOut.value);

        if (!idVila ||isNaN(tglIn) || isNaN(tglOut)) {
            infoDurasi.textContent = '0';
            infoHargaSatuan.textContent = 'Rp 0';
            infoTotalBiaya.textContent = 'Rp 0';
            return;
        }

        const vilaDipilih = dataVila.find(v => v.id === idVila);
        const selisihWaktu = tglOut.getTime() - tglIn.getTime();
        const jumlahMalam = Math.ceil(selisihWaktu / (1000 * 3600 * 24));

        if (jumlahMalam > 0) {
            const total = jumlahMalam * vilaDipilih.harga;
            infoDurasi.textContent = jumlahMalam;
            infoHargaSatuan.textContent = `Rp ${vilaDipilih.harga.toLocaleString('id-ID')}`;
            infoTotalBiaya.textContent = `Rp ${total.toLocaleString('id-ID')}`;
        } else {
            infoDurasi.textContent = '0';
            infoHargaSatuan.textContent = `Rp ${vilaDipilih.harga.toLocaleString('id-ID')}`;
            infoTotalBiaya.textContent = 'Rp 0';
        }
    } catch (error) {
        console.error("Terjadi kesalahan dalam perhitungan:", error);
    }
}

function validasiForm(nama, tglInStr, tglOutStr, jumlahTamu) {
    const hariIni = new Date();
    hariIni.setHours(0, 0, 0, 0);

    const checkInDate = new Date(tglInStr);
    const checkOutDate = new Date(tglOutStr);

    if (!nama.trim()) {
        return "Nama lengkap tamu wajib diisi.";
    }
    if (checkInDate < hariIni) {
        return "Tanggal check-in tidak boleh di masa lalu.";
    }
    if (checkOutDate <= checkInDate) {
        return "Tanggal check-out harus setelah tanggal check-in.";
    }
    if (jumlahTamu < 1 || jumlahTamu > 10) {
        return "Jumlah tamu harus antara 1 sampai 10 orang.";
    }
    return null;
}

inputPencarian.addEventListener('input', (e) => {
    const keyword = e.target.value.toLowerCase();
    const hasilFilter = dataVila.filter(v => 
        v.nama.toLowerCase().includes(keyword) || 
        v.fasilitas.toLowerCase().includes(keyword) ||
        v.lokasi.toLowerCase().includes(keyword)
    );
    renderVila(hasilFilter);
});

pilihVila.addEventListener('change', hitungTotalHarga);
inputCheckIn.addEventListener('change', hitungTotalHarga);
inputCheckOut.addEventListener('change', hitungTotalHarga);

formPemesanan.addEventListener('submit', (e) => {
    e.preventDefault();
    pesanError.textContent = '';
    pesanSukses.textContent = '';

    const nama = document.getElementById('namaTamu').value;
    const idVila = pilihVila.value;
    const tglIn = inputCheckIn.value;
    const tglOut = inputCheckOut.value;
    const jmlTamu = parseInt(inputJumlahTamu.value);

    const errorMsg = validasiForm(nama, tglIn, tglOut, jmlTamu);
    if (errorMsg) {
        pesanError.textContent = errorMsg;
        return;
    }

    const vilaObj = dataVila.find(v => v.id === idVila);
    const selisihMalam = Math.ceil((new Date(tglOut) - new Date(tglIn)) / (1000 * 3600 * 24));
    const totalBiaya = selisihMalam * vilaObj.harga;

    const dataPesanan = {
        nama: nama,
        vila: vilaObj.nama,
        checkIn: tglIn,
        checkOut: tglOut,
        malam: selisihMalam,
        tamu: jmlTamu,
        total: totalBiaya,
        waktuPesan: new Date().toLocaleString('id-ID')
    }

    localStorage.setItem('pesananVilaPermai', JSON.stringify(dataPesanan));

    pesanSukses.textContent = `Terima kasih ${nama}, pemesanan ${vilaObj.nama} berhasil dicatat! Total biaya: Rp ${totalBiaya.toLocaleString('id-ID')}.`;
    muatRiwayatLokal();
    formPemesanan.reset();
    hitungTotalHarga();
});

function muatRiwayatLokal() {
    const savedData = localStorage.getItem('pesananVilaPermai');
    if (savedData) {
        const pesanan = JSON.parse(savedData);
        infoRiwayat.innerHTML = `
            <p><strong>Nama Tamu:</strong> ${pesanan.nama}</p>
            <p><strong>Vila:</strong> ${pesanan.vila}</p>
            <p><strong>Check-In / Out:</strong> ${pesanan.checkIn} s.d. ${pesanan.checkOut} (${pesanan.malam} malam)</p>
            <p><strong>Jumlah Tamu:</strong> ${pesanan.tamu} orang</p>
            <p><strong>Total Pembayaran:</strong> Rp ${pesanan.total.toLocaleString('id-ID')}</p>
            <p><small>Waktu Transaksi: ${pesanan.waktuPesan}</small></p>
        `;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    renderVila(dataVila);
    populateDropdown();
    muatRiwayatLokal();
});